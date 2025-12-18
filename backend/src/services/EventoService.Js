const Evento = require("../models/Evento");
const fs = require("fs").promises;
const path = require("path");

class EventoService {
  constructor() {
    this.eventoRepository = new Evento();
  }

  async criarEvento(
    nome,
    local,
    data,
    descricao,
    pequenoPorte = false,
    reportadoPorUsuario = false,
    aoVivo = false,
    moedasCapibasDestribuidas = 0,
    ativo = true,
    preco = "Gratuito",
    faixaEtaria = 0,
    precisaInscricao = false,
    horario = null,
    imagemUrl = null,
    latitude,
    longitude,
  ) {
    if (!nome || !local || !data || !descricao)
      throw new Error("Campos obrigatórios: nome, local, data, descricao");

    const eventoDuplicado = await this.eventoRepository.obterPorNomeLocalEData(
      nome,
      local,
      data,
    );
    if (eventoDuplicado) {
      throw new Error(
        "Um evento com o mesmo nome e local já está agendado para esta data.",
      );
    }

    return await this.eventoRepository.novoEvento(
      nome,
      local,
      data,
      descricao,
      pequenoPorte,
      reportadoPorUsuario,
      aoVivo,
      moedasCapibasDestribuidas,
      ativo,
      preco,
      faixaEtaria,
      precisaInscricao,
      horario,
      imagemUrl,
      latitude,
      longitude,
    );
  }

  async criarEvento(
    nome,
    local,
    data,
    descricao,
    pequenoPorte,
    reportadoPorUsuario,
    aoVivo,
    moedasCapibasDestribuidas,
    ativo,
    preco,
    faixaEtaria,
    precisaInscricao,
    horario,
    imagemUrl,
    latitude,
    longitude,
  ) {
    return await this.eventoRepository.novoEvento(
      nome,
      local,
      data,
      descricao,
      pequenoPorte,
      reportadoPorUsuario,
      aoVivo,
      moedasCapibasDestribuidas,
      ativo,
      preco,
      faixaEtaria,
      precisaInscricao,
      horario,
      imagemUrl,
      latitude,
      longitude,
    );
  }

  async listarEventos(filtros) {
    console.log("🔍 Service: Filtrando eventos com:", filtros);

    let whereClause = {};

    if (filtros.mes && filtros.ano) {
      const mesIndex = filtros.mes - 1;
      const ano = filtros.ano;

      const inicio = new Date(Date.UTC(ano, mesIndex, 1));

      const fim = new Date(Date.UTC(ano, mesIndex + 1, 1));

      console.log(
        `📅 Intervalo calculado: ${inicio.toISOString()} até ${fim.toISOString()}`,
      );

      whereClause.data = {
        gte: inicio,
        lt: fim,
      };
    } else if (filtros.data) {
      const [ano, mes, dia] = filtros.data.split("-").map(Number);
      const inicio = new Date(Date.UTC(ano, mes - 1, dia));
      const fim = new Date(Date.UTC(ano, mes - 1, dia + 1));

      whereClause.data = {
        gte: inicio,
        lt: fim,
      };
    }

    if (filtros.pendentes) {
      whereClause.ativo = false;
    } else {
      whereClause.ativo = true;

      const eventos = await this.eventoRepository.listar(whereClause);
      console.log(`✅ Eventos encontrados: ${eventos.length}`);
      return eventos;
    }
  }

  async atualizarStatus(id, ativo) {
    return await prisma.evento.update({
      where: { id: Number(id) },
      data: { ativo: ativo },
    });
  }

  async obterPorId(id) {
    const evento = await this.eventoRepository.obterPorId(id);
    if (!evento) {
      throw new Error("Evento não encontrado");
    }
    return evento;
  }

  async obterPorNome(nome) {
    const evento = await this.eventoRepository.obterPorNome(nome);
    if (!evento) {
      throw new Error("Evento não encontrado");
    }
    return evento;
  }

  async obterPorLocal(local) {
    const evento = await this.eventoRepository.obterPorLocal(local);
    if (!evento) {
      throw new Error("Evento não encontrado");
    }
    return evento;
  }

  async removerEvento(id) {
    const evento = await this.eventoRepository.obterPorId(id);
    if (!evento) {
      throw new Error("Evento não encontrado");
    }

    if (evento.imagemUrl) {
      try {
        const nomeDoArquivo = evento.imagemUrl.replace("uploads/", "");

        const caminhoBase = path.join(__dirname, "..", "..", "uploads");
        const caminhoCompleto = path.join(caminhoBase, nomeDoArquivo);

        console.log(
          `[DELEÇÃO DE ARQUIVO] Tentando deletar arquivo em: ${caminhoCompleto}`,
        );

        await fs.unlink(caminhoCompleto);
        console.log(`[DELEÇÃO DE ARQUIVO] Imagem deletada com sucesso!`);
      } catch (error) {
        if (error.code === "ENOENT") {
          console.warn(
            `[DELEÇÃO DE ARQUIVO] AVISO: Arquivo não encontrado no disco (ENOENT).`,
          );
        } else {
          console.error(
            `[DELEÇÃO DE ARQUIVO] ERRO FATAL: Falha ao deletar arquivo. Código: ${error.code}. Mensagem: ${error.message}`,
          );
        }
      }
    }

    return await this.eventoRepository.removerEvento(id);
  }
}

module.exports = new EventoService();

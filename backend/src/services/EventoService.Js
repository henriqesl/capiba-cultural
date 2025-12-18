const Evento = require("../models/Evento");
const fs = require('fs').promises;
const path = require('path');

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
    longitude
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
      longitude
    );
  }

  async criarEvento(nome, local, data, descricao, pequenoPorte, reportadoPorUsuario, aoVivo, moedasCapibasDestribuidas, ativo, preco, faixaEtaria, precisaInscricao, horario, imagemUrl, latitude, longitude) {
    // Mantém lógica padrão de criação
    return await this.eventoRepository.novoEvento(nome, local, data, descricao, pequenoPorte, reportadoPorUsuario, aoVivo, moedasCapibasDestribuidas, ativo, preco, faixaEtaria, precisaInscricao, horario, imagemUrl, latitude, longitude);
  }

  async listarEventos(filtros) {
    console.log("🔍 LISTAR EVENTOS CHAMADO. Filtros recebidos:", filtros);

    // 🔴 MODO DEBUG: Ignora todos os filtros e busca tudo que existe no banco
    // Isso garante que se houver registro, ele aparece.
    const todosEventos = await this.eventoRepository.listar({}); 
    
    console.log(`✅ Encontrados ${todosEventos.length} eventos no total (sem filtros).`);
    
    return todosEventos;
  }

  async atualizarStatus(id, ativo) {
      return await prisma.evento.update({
          where: { id: Number(id) },
          data: { ativo: ativo }
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
            const nomeDoArquivo = evento.imagemUrl.replace('uploads/', '');
            
            const caminhoBase = path.join(__dirname, '..', '..', 'uploads');
            const caminhoCompleto = path.join(caminhoBase, nomeDoArquivo); 

            console.log(`[DELEÇÃO DE ARQUIVO] Tentando deletar arquivo em: ${caminhoCompleto}`);
            
            await fs.unlink(caminhoCompleto);
            console.log(`[DELEÇÃO DE ARQUIVO] Imagem deletada com sucesso!`);

        } catch (error) {
            if (error.code === 'ENOENT') {
                console.warn(`[DELEÇÃO DE ARQUIVO] AVISO: Arquivo não encontrado no disco (ENOENT).`);
            } else {
                console.error(`[DELEÇÃO DE ARQUIVO] ERRO FATAL: Falha ao deletar arquivo. Código: ${error.code}. Mensagem: ${error.message}`);
            }
        }
    }
    
    return await this.eventoRepository.removerEvento(id);
  }
}

module.exports = new EventoService(); 
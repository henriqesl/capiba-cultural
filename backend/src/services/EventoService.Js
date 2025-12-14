const Evento = require("../models/Evento");
const fs = require('fs').promises;
const path = require('path');

class EventoService {
  constructor() {
    this.eventoRepository = new Evento();
  }

  async criarEvento(
    nome, local, data, descricao, 
    imagemUrl, faixaEtaria, preco, precisaInscricao, categoria, 
    pequenoPorte = false, reportadoPorUsuario = false
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
      nome, local, data, descricao,
      imagemUrl, faixaEtaria, preco, precisaInscricao, categoria 
    );
  }

  async listarEventos() {
    return await this.eventoRepository.listar();
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
            // 1. Extrai o nome do arquivo da URL (ex: 'uploads/abc.jpg' -> 'abc.jpg')
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

        return await this.eventoRepository.removerEvento(id);
    }
  }
  
}

module.exports = new EventoService();

const Evento = require("../models/Evento");

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
    participantesIds = [],
    caravanasIds = [],
  ) {
    if (!nome || !local || !data || !descricao)
      throw new Error("Todos os campos são obrigatórios");

    if (isNaN(Date.parse(data))) throw new Error("Data inválida");

    const eventoDuplicado = await this.eventoRepository.obterPorNomeLocalEData(
      nome,
      local,
      data,
      descricao,
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
      (pequenoPorte = false),
      (reportadoPorUsuario = false),
      (participantesIds = []),
      (caravanasIds = []),
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
    const evento = this.eventoRepository.obterPorId(id);
    if (!evento) {
      throw new Error("Evento não encontrado");
    }

    return await this.eventoRepository.removerEvento(id);
  }
}

module.exports = new EventoService();

const Evento = require('../models/Evento');

class EventoService {
    constructor() {
        this.eventoRepository = new Evento();
    }

    criarEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false) {
        if (!nome || !local || !data || !descricao)
            throw new aaError("Todos os campos são obrigatórios");

        if (isNaN(Date.parse(data)))
            throw new Error("Data inválida");

        if (!reportadoPorUsuario && this.eventos.some(e => e.nome.toLowerCase() === nome.toLowerCase()))
            throw new Error("Evento já cadastrado");

        const evento = this.eventoRepository.novoEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false);
        return evento;
    }

    listarEventos() {
        return this.eventoRepository.listar();
    }

    obterPorId(id) {
        const evento = this.eventoRepository.obterPorId(id);
        if (!evento) {
            throw new Error("Evento não encontrado");
        }
        return evento;
    }

    obterPorNome(nome) {
        
        const evento = this.eventoRepository.obterPorNome(nome);
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
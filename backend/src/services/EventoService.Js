const Evento = require('../models/Evento');

class EventoService {
    constructor() {
        this.eventos = [];
        this.nextId = 1;
    }

    criarEvento(nome, local, data, descricao) {
        if (!nome || !local || !data || !descricao)
            throw new Error("Todos os campos são obrigatórios");

        if (isNaN(Date.parse(data)))
            throw new Error("Data inválida");

        if (this.eventos.some(e => e.nome === nome))
            throw new Error("Evento já cadastrado");

        const evento = new Evento(nome, local, data, descricao);
        evento.id = this.nextId++;
        this.eventos.push(evento);
        return evento;
    }

    listarEventos() {
        return this.eventos;
    }

    obterPorId(id) {
        const evento = this.eventos.find(e => e.id === id);
        if (!evento) throw new Error("Evento não encontrado");
        return evento;
    }

    removerEvento(id) {
        const index = this.eventos.findIndex(e => e.id === id);
        if (index === -1) throw new Error("Evento não encontrado");
        const [eventoRemovido] = this.eventos.splice(index, 1);
        return eventoRemovido;
    }
}

module.exports = EventoService;
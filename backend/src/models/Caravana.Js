const Evento = require('./Evento');

class Caravana {
    constructor(nome) {
        this.id = null;
        this.nome = nome;
        this.eventoDestino = null;
        this.eventoId = null;
        this.membros = [];
        this.bonusPorParticipante = 10;
    }

    getId() { return this.id; }
    setId(valor) {
        if (typeof valor !== 'number' || valor <= 0) throw new Error("ID inválido.");
        this.id = valor;
    }

    getNome() { return this.nome; }
    setNome(valor) {
        if (!valor || typeof valor !== 'string') throw new Error("Nome inválido.");
        this.nome = valor;
    }

    getEventoDestino() { return this.eventoDestino; }
    setEventoDestino(evento) {
        if (!evento || typeof evento.getId !== 'function' || typeof evento.getNome !== 'function') {
            throw new Error("Evento inválido");
        }
        this.eventoDestino = evento;
        this.eventoId = evento.getId();
    }

    getEventoId() { return this.eventoId; }
    setEventoId(id) {
        if (typeof id !== 'number' || id <= 0) throw new Error("ID de evento inválido.");
        this.eventoId = id;
    }

    getMembros() { return [...this.membros]; }
    setMembros(lista) {
        if (!Array.isArray(lista)) throw new Error("Lista de membros inválida.");
        this.membros = lista;
    }

    getBonusPorParticipante() { return this.bonusPorParticipante; }
    setBonusPorParticipante(valor) {
        if (typeof valor !== 'number' || valor < 0) throw new Error("Bônus inválido.");
        this.bonusPorParticipante = valor;
    }
}

module.exports = Caravana;

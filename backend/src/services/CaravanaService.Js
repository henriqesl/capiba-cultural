const Caravana = require('../models/Caravana');

class CaravanaService {
    constructor() {
        this.caravanas = [];
        this.nextId = 1;
    }

    criarCaravana(nome, eventoDestino) {
        if (!nome || !eventoDestino) {
            throw new Error("Nome e evento de destino são obrigatórios.");
        }

        const caravana = new Caravana(nome, eventoDestino);
        caravana.id = this.nextId++;
        this.caravanas.push(caravana);

        return caravana;
    }

    listarCaravanas() {
        return this.caravanas;
    }

    obterPorId(id) {
        const caravana = this.caravanas.find(c => c.id === id);
        if (!caravana) {
            throw new Error("Caravana não encontrada.");
        }
        return caravana;
    }

    adicionarMembro(caravanaId, usuario) {
        const caravana = this.obterPorId(caravanaId);
        if (!usuario) {
            throw new Error("Usuário inválido.");
        }
        caravana.adicionarMembro(usuario);
        return caravana;
    }
}

module.exports = CaravanaService;
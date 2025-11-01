const Caravana = require('../models/Caravana');
const usuarioService = require('./UsuarioService');

class CaravanaService {
    constructor() {
        this.caravanas = [];
        this.nextId = 1;
    }

    criarCaravana(nome) {
        if (!nome) throw new Error("Nome é obrigatório.");
        const caravana = new Caravana(nome);
        caravana.setId(this.nextId++);
        this.caravanas.push(caravana);
        return caravana;
    }

    listarCaravanas() {
        return this.caravanas;
    }

    obterPorId(id) {
        const caravana = this.caravanas.find(c => c.getId() === id);
        if (!caravana) throw new Error("Caravana não encontrada.");
        return caravana;
    }

    adicionarMembro(caravanaId, usuarioId) {
        const caravana = this.obterPorId(caravanaId);
        const usuario = usuarioService.obterPorId(usuarioId);

        if (!usuario) throw new Error("Usuário inválido.");

        const membros = caravana.getMembros();
        membros.push(usuario);
        caravana.setMembros(membros);

        usuarioService.adicionarMoedas(usuarioId, caravana.getBonusPorParticipante());
        return caravana;
    }

    removerCaravana(id) {
        const index = this.caravanas.findIndex(c => c.getId() === id);
        if (index === -1) throw new Error("Caravana não encontrada.");
        const [removida] = this.caravanas.splice(index, 1);
        return removida;
    }

    adicionarDestino(caravanaId, evento) {
        const caravana = this.obterPorId(caravanaId);
        caravana.setEventoDestino(evento);
        return caravana;
    }
}

module.exports = new CaravanaService();
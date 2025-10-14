const Usuario = require('./Models/Usuario');
const Evento = require('./Models/Evento');

class Caravana {
    constructor(nome, eventoDestino) {
        this.id = null; 
        this.nome = nome;
        this.eventoId = eventoDestino ? eventoDestino.id : null;
        this.eventoDestino = eventoDestino || null;
        this.membros = [];
        this.bonusPorParticipante = 10;
    }

    adicionarMembro(usuario) {
        if (!usuario) throw new Error('Usuário inválido.');
        this.membros.push(usuario);
        usuario.adicionarMoedas(this.bonusPorParticipante);
    }
}

module.exports = Caravana;
const Usuario = require('./Models/Usuario');
const Caravana = require('./Models/Caravana');

class Evento {
    constructor(nome, local, data, descricao = '', pequenoPorte = false) {
        this.id = null;
        this.nome = nome;
        this.local = local;
        this.data = data instanceof Date ? data : new Date(data);
        this.descricao = descricao;
        this.ativo = true;
        this.aoVivo = false;
        this.isPequenoPorte = pequenoPorte;
        this.participantes = [];
        this.moedasDistribuidas = 0;
        this.caravanas = [];
    }

    adicionarParticipante(usuario) {
        if (!usuario) throw new Error('Usuário inválido.');
        this.participantes.push(usuario);
    }
}

module.exports = Evento;
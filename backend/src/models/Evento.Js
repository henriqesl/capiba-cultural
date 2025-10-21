const Usuario = require('./usuario');
const Caravana = require('./caravana');

class Evento {
    constructor(nome, local, data, descricao = '', pequenoPorte = false, reportadoPorUsuario = false) {
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
        this.reportadoPorUsuario = reportadoPorUsuario;
        this.confirmacoes = 0;
    }

    adicionarParticipante(usuario) {
        if (!usuario) throw new Error('Usuário inválido.');
        this.participantes.push(usuario);
    }

    adicionarConfirmacao() {
        this.confirmacoes++;
        if (this.confirmacoes >= 3) {
            this.aoVivo = true;
        }
    }
}

module.exports = Evento;
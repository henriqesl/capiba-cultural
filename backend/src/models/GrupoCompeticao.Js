const Usuario = require('./Models/Usuario');

class GrupoCompeticao {
    constructor(nome, dataInicio, dataFim) {
        this.id = null;
        this.nome = nome;
        this.membros = [];
        this.dataInicio = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
        this.dataFim = dataFim instanceof Date ? dataFim : new Date(dataFim);
    }

    adicionarMembro(usuario) {
        if (!usuario) throw new Error('Usuário inválido.');
        this.membros.push(usuario);
    }

    obterVencedor() {
        if (this.membros.length === 0) return null;
        return this.membros.reduce((max, u) => (u.saldoMoedaCapiba > (max?.saldoMoedaCapiba || 0) ? u : max), null);
    }
}

module.exports = GrupoCompeticao;
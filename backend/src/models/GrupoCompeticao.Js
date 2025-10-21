const Usuario = require('./usuario');

class GrupoCompeticao {
    constructor(nome, dataInicio, dataFim) {
        this.id = null;
        this.nome = nome;
        this.membros = [];
        this.dataInicio = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
        this.dataFim = dataFim instanceof Date ? dataFim : new Date(dataFim);
        this.encerrado = false;
        this.pontuacaoTotal = 0;
        this.vencedor = null;
    }

    adicionarMembro(usuario) {
        if (!usuario) throw new Error('Usuário inválido.');
        if (this.encerrado) throw new Error('Não é possível adicionar membros a um grupo encerrado.');
        this.membros.push(usuario);
        this.atualizarPontuacao();
    }

    atualizarPontuacao() {
        this.pontuacaoTotal = this.membros.reduce(
            (total, membro) => total + (membro.saldoMoedaCapiba || 0),
            0
        );
    }

    obterVencedor() {
        if (this.membros.length === 0) return null;
        this.vencedor = this.membros.reduce(
            (max, u) => (u.saldoMoedaCapiba > (max?.saldoMoedaCapiba || 0) ? u : max),
            null
        );
        return this.vencedor;
    }

    encerrarGrupo() {
        if (this.encerrado) throw new Error('O grupo já foi encerrado.');
        this.encerrado = true;
        this.vencedor = this.obterVencedor();
    }

    estaExpirado() {
        return new Date() > this.dataFim;
    }
}

module.exports = GrupoCompeticao;
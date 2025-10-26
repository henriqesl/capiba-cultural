const Usuario = require('../usuario');

class GrupoCompeticao {
    constructor(id, nome, dataInicio, dataFim, encerrado = false, pontuacaoTotal = 0, membros = [], vencedor = null) {
        this.id = id;
        this.nome = nome;
        this.dataInicio = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
        this.dataFim = dataFim instanceof Date ? dataFim : new Date(dataFim);
        this.encerrado = encerrado;
        this.pontuacaoTotal = pontuacaoTotal;
        this.membros = membros;
        this.vencedor = vencedor;
    }

    static fromPrisma(prismaData) {
        if (!prismaData) return null;

        return new GrupoCompeticao(
            prismaData.id,
            prismaData.nome,
            prismaData.dataInicio,
            prismaData.dataFim,
            prismaData.encerrado,
            prismaData.pontuacaoTotal,
            prismaData.membros || [],
            prismaData.vencedor || null
        );
    }

    adicionarMembro(usuario) {
        if (!usuario) throw new Error('Usuário inválido.');
        if (this.encerrado) throw new Error('Grupo encerrado, não é possível adicionar novos membros.');
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

    get resumo() {
        return `Grupo: ${this.nome} | Encerrado: ${this.encerrado ? 'Sim' : 'Não'} | Pontuação: ${this.pontuacaoTotal}`;
    }
}

module.exports = GrupoCompeticao;

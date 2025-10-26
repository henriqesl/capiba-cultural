class Usuario {
    constructor(id, nome, email, senha, saldoMoedaCapiba = 0, dataCadastro = new Date()) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.saldoMoedaCapiba = saldoMoedaCapiba;
        this.dataCadastro = dataCadastro;
        this.caravanas = [];
        this.grupos = [];
    }

    adicionarMoedas(quantidade) {
        if (quantidade <= 0) throw new Error("Quantidade deve ser positiva");
        this.saldoMoedaCapiba += quantidade;
    }

    gastarMoedas(quantidade) {
        if (quantidade <= 0) throw new Error("Quantidade deve ser positiva");
        if (this.saldoMoedaCapiba < quantidade) throw new Error("Saldo insuficiente");
        this.saldoMoedaCapiba -= quantidade;
    }

    static fromPrisma(prismaData) {
        if (!prismaData) return null;
        return new Usuario(
            prismaData.id,
            prismaData.nome,
            prismaData.email,
            prismaData.senha,
            prismaData.saldoMoedaCapiba,
            prismaData.dataCadastro
        );
    }
}

module.exports = Usuario;

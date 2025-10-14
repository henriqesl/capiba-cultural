class Usuario {
    constructor(nome, email, senha) {

        this.id = null;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.saldoMoedaCapiba = 0;
        this.dataCadastro = new Date();

        this.caravanas = [];
        this.grupos = [];
    }

    adicionarMoedas(quantidade) {
        if (quantidade <= 0) throw new Error("Quantidade deve ser positiva");
        this.saldoMoedaCapiba += quantidade;
    }

    gastarMoedas(quantidade) {
        if (quantidade <= 0) throw new Error("Quantidade deve ser positiva");
        if (this.saldoMoedaCapiba < quantidade) return false;

        this.saldoMoedaCapiba -= quantidade;
        return true;
    }
}

module.exports = Usuario;
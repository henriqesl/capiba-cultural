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

    getSaldo() {
        return this.saldoMoedaCapiba;
    }

    setSaldo(saldo) {
        if (saldo < 0) throw new Error("Saldo não pode ser negativo");
        this.saldoMoedaCapiba = saldo;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}

module.exports = Usuario;
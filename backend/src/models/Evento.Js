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

    setId(id) { this.id = id; }
    getId() { return this.id; }

    setNome(nome) { this.nome = nome; }
    getNome() { return this.nome; }

    setLocal(local) { this.local = local; }
    getLocal() { return this.local; }

    setData(data) { this.data = data instanceof Date ? data : new Date(data); }
    getData() { return this.data; }

    setDescricao(descricao) { this.descricao = descricao; }
    getDescricao() { return this.descricao; }

    setReportadoPorUsuario(valor) { this.reportadoPorUsuario = valor; }
    getReportadoPorUsuario() { return this.reportadoPorUsuario; }
}

module.exports = Evento;

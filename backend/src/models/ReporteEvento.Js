class ReporteEvento {
    constructor(reportante, evento, descricao = '') {
        if (!reportante) throw new Error('Reportante inválido.');
        if (!evento) throw new Error('Evento inválido.');

        this.id = null;
        this.reportante = reportante;
        this.evento = evento;
        this.dataReporte = new Date();
        this.descricao = descricao;
        this.reportantes = [reportante];
        this.qtdConfirmacoes = 1;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getReportante() {
        return this.reportante;
    }

    setReportante(reportante) {
        this.reportante = reportante;
    }

    getEvento() {
        return this.evento;
    }

    setEvento(evento) {
        this.evento = evento;
    }

    getDataReporte() {
        return this.dataReporte;
    }

    setDataReporte(data) {
        this.dataReporte = data;
    }

    getDescricao() {
        return this.descricao;
    }

    setDescricao(descricao) {
        this.descricao = descricao;
    }

    getReportantes() {
        return this.reportantes;
    }

    setReportantes(reportantes) {
        this.reportantes = reportantes;
    }

    getQtdConfirmacoes() {
        return this.qtdConfirmacoes;
    }

    setQtdConfirmacoes(qtd) {
        this.qtdConfirmacoes = qtd;
    }
}

module.exports = ReporteEvento;
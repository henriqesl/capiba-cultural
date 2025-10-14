const Usuario = require('./Models/Usuario');
const Evento = require('./Models/Evento');

class ReporteEvento {
    constructor(reportante, evento, descricao = '') {
        if (!reportante) throw new Error('Reportante inválido.');
        if (!evento) throw new Error('Evento inválido.');

        this.id = null;
        this.reportante = reportante;
        this.evento = evento;
        this.dataReporte = new Date();
        this.descricao = descricao;
    }
}

module.exports = ReporteEvento;
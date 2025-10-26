const Usuario = require('./Usuario');
const Evento = require('../Evento');

class ReporteEvento {
    constructor(id, reportante, evento, descricao = '', dataReporte = new Date()) {
        if (!reportante) throw new Error('Reportante inválido.');
        if (!evento) throw new Error('Evento inválido.');

        this.id = id;
        this.reportante = reportante;
        this.evento = evento;
        this.descricao = descricao;
        this.dataReporte = dataReporte;
    }

    static fromPrisma(prismaData) {
        if (!prismaData) return null;

        return new ReporteEvento(
            prismaData.id,
            prismaData.reportante,
            prismaData.evento,
            prismaData.descricao,
            prismaData.dataReporte
        );
    }
}

module.exports = ReporteEvento;

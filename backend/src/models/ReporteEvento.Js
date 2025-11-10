const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReporteEvento {
    async criarReporteEvento(reportante, evento, descricao) {
        if (!reportante) throw new Error('Reportante inválido.');
        if (!evento) throw new Error('Evento inválido.');

        return await prisma.ReporteEvento.create({
            data: {
                reportante,
                evento,
                descricao,
                dataReporte: new Date(),
                qtdConfirmacoes: 1,
                reportantes: [reportante]

            }
        })

    }

    async listar() {
        return await prisma.ReporteEvento.findMany();
    }

    async buscarPorId(id) {
        return await prisma.reporteEvento.findUnique({
            where: { id: id },
        });
    }

    async remover(id) {
        return await prisma.ReporteEvento.delete({
            where: { id: id}
        })
    }


    async getReportante(id) {
        return await prisma.ReporteEvento.findUnique({
            where: { id: id },
            select: { reportante: reportante }
        })
    }

    async setReportante(id, reportante) {
        return await prisma.ReporteEvento.update({
            where: { id: id },
            data: { reportante: reportante },
            select: { reportante: true}
        })
    }


    async getEvento(id) {
        return await prisma.ReporteEvento.findUnique({
            where: { id: id },
            select: { evento: evento }
        })
    }

    async setEvento(id, evento) {
        return await prisma.ReporteEvento.update({
            where: { id: id },
            data: { evento: evento },
            select: { evento: true}
        })
    }

    async getEvento(id) {
        const reporte = await prisma.reporteEvento.findUnique({
            where: { id },
            include: { evento: true }
        });
        return reporte?.evento || null;
    }

  
    async getDataReporte(id) {
        const reporte = await prisma.reporteEvento.findUnique({
            where: { id },
            select: { dataReporte: true }
        });
        return reporte?.dataReporte || null;
    }

    async setDataReporte(id, data) {
        return await prisma.reporteEvento.update({
            where: { id },
            data: { dataReporte: data },
            select: { dataReporte: true }
        });
    }

    async getDescricao(id) {
        const reporte = await prisma.reporteEvento.findUnique({
            where: { id },
            select: { descricao: true }
        });
        return reporte?.descricao || null;
    }

    async setDescricao(id, descricao) {
        return await prisma.reporteEvento.update({
            where: { id },
            data: { descricao },
            select: { descricao: true }
        });
    }
 
 
    async getReportantes(id) {
        const reporte = await prisma.reporteEvento.findUnique({
            where: { id },
        });
        return reporte?.reportantes || [];
    }

    async setReportantes(id, reportanteIds) {
        return await prisma.reporteEvento.update({
            where: { id },
            data: {
                reportantes: {
                    set: reportanteIds.map(uid => ({ id: uid }))
                }
            },
        });
    }

    async getQtdConfirmacoes(id) {
        const reporte = await prisma.reporteEvento.findUnique({
            where: { id },
            select: { qtdConfirmacoes: true }
        });
        return reporte?.qtdConfirmacoes || 0;
    }

    async setQtdConfirmacoes(id, qtd) {
        return await prisma.reporteEvento.update({
            where: { id },
            data: { qtdConfirmacoes: qtd },
            select: { qtdConfirmacoes: true }
        });
    }
}


module.exports = ReporteEvento;
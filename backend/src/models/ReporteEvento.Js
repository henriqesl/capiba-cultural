const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ReporteEvento {
  async criarReporteEvento(reportanteId, evento, descricao) {
    if (!reportante) throw new Error("Reportante inválido.");
    if (!evento) throw new Error("Evento inválido.");

    return await prisma.reporteEvento.create({
      data: {
        descricao,
        dataReporte: new Date(),
        qtdConfirmacoes: 1,
        evento: { connect: { id: evento.id } },
        reportante: { connect: { id: reportanteId } },
        confirmadores: { connect: { id: reportanteId } },
      },
      include: { evento: true, reportante: true, confirmadores: true },
    });
  }

  async listar() {
    return await prisma.reporteEvento.findMany();
  }

  async buscarPorId(id) {
    return await prisma.reporteEvento.findUnique({
      where: { id: id },
    });
  }

  async remover(id) {
    return await prisma.reporteEvento.delete({
      where: { id: id },
    });
  }

  async getReportante(id) {
    const reporte = await prisma.reporteEvento.findUnique({
      where: { id },
      include: { reportante: true },
    });
    return reporte?.reportante || [];
  }

  async setReportante(id, reportanteIds) {
    return await prisma.reporteEvento.update({
      where: { id },
      data: {
        reportante: {
          set: reportanteIds.map((uid) => ({ id: uid })),
        },
      },
    });
  }

  async setEvento(id, evento) {
    return await prisma.reporteEvento.update({
      where: { id: id },
      data: { evento: evento },
      select: { evento: true },
    });
  }

  async getEvento(id) {
    const reporte = await prisma.reporteEvento.findUnique({
      where: { id },
      include: { evento: true },
    });
    return reporte?.evento || null;
  }

  async getDataReporte(id) {
    const reporte = await prisma.reporteEvento.findUnique({
      where: { id },
      select: { dataReporte: true },
    });
    return reporte?.dataReporte || null;
  }

  async setDataReporte(id, data) {
    return await prisma.reporteEvento.update({
      where: { id },
      data: { dataReporte: data },
      select: { dataReporte: true },
    });
  }

  async getDescricao(id) {
    const reporte = await prisma.reporteEvento.findUnique({
      where: { id },
      select: { descricao: true },
    });
    return reporte?.descricao || null;
  }

  async setDescricao(id, descricao) {
    return await prisma.reporteEvento.update({
      where: { id },
      data: { descricao },
      select: { descricao: true },
    });
  }

  async getQtdConfirmacoes(id) {
    const reporte = await prisma.reporteEvento.findUnique({
      where: { id },
      select: { qtdConfirmacoes: true },
    });
    return reporte?.qtdConfirmacoes || 0;
  }

  async setQtdConfirmacoes(id, qtd) {
    return await prisma.reporteEvento.update({
      where: { id },
      data: { qtdConfirmacoes: qtd },
      select: { qtdConfirmacoes: true },
    });
  }
}

module.exports = ReporteEvento;

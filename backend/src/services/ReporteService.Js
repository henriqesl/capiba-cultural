const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const eventoService = require("./EventoService");
const ReporteEvento = require("../models/ReporteEvento");

class ReporteService {
  constructor() {
    this.reporteEventoRepository = new ReporteEvento();
    this.eventoService = eventoService;
  }

  async criarOuConfirmarReporte(reportanteId, eventoInput, descricao = "") {
    if (!reportanteId || !eventoInput) {
      throw new Error(
        "Reportante e evento são obrigatórios para criar um reporte!",
      );
    }

    let evento = await this.eventoService.obterPorNome(eventoInput.nome);

    if (!evento) {
      console.log("Evento não encontrado. Criando novo evento...");

      const nome = eventoInput.nome || "Evento sem nome";
      const local = eventoInput.local || "Local não informado";
      const data = eventoInput.data ? new Date(eventoInput.data) : new Date();
      const descricaoEvento =
        eventoInput.descricao || "Evento reportado por usuário";

      evento = await this.eventoService.criarEvento(
        nome,
        local,
        data,
        descricaoEvento,
        false,
        true,
      );
      await evento.setReportadoPorUsuario(true);
    }

    const existente = await prisma.reporteEvento.findFirst({
      where: { eventoId: evento.id },
      include: { reportantes: true },
    });

    if (existente) {
      const jaConfirmou = existente.reportantes.some(
        (u) => u.id === reportanteId,
      );
      if (jaConfirmou) {
        return {
          mensagem: "Usuário já reportou/confirmou este evento.",
          reporte: existente,
        };
      }

      const atualizado = await prisma.reporteEvento.update({
        where: { id: existente.id },
        data: {
          reportantes: { connect: { id: reportanteId } },
          qtdConfirmacoes: existente.qtdConfirmacoes + 1,
        },
        include: { evento: true, reportantes: true },
      });

      return {
        mensagem: "Confirmação adicionada a um evento já reportado.",
        reporte: atualizado,
      };
    }

    const agora = new Date();
    const cincoMinutosAtras = new Date(agora.getTime() - 5 * 60 * 1000);

    const existeReporteRecente = await prisma.reporteEvento.findFirst({
      where: {
        eventoId: evento.id,
        reportantes: { some: { id: reportanteId } },
        dataReporte: { gte: cincoMinutosAtras },
      },
    });

    if (existeReporteRecente) {
      throw new Error(
        "Você já enviou um reporte recentemente. Aguarde alguns minutos.",
      );
    }

    const novoReporte = await prisma.reporteEvento.create({
      data: {
        descricao,
        dataReporte: new Date(),
        qtdConfirmacoes: 1,
        evento: { connect: { id: evento.id } },
        reportantes: { connect: { id: reportanteId } },
        reportante: { connect: { id: reportanteId } },
      },

      include: { evento: true, reportantes: true },
    });

    return {
      mensagem: "Novo evento reportado com sucesso.",
      reporte: novoReporte,
    };
  }

  listarReportes() {
    return this.reporteEventoRepository.listar();
  }

  async listarPorEvento(eventoId) {
    return await prisma.reporteEvento.findMany({
      where: { eventoId },
      include: { evento: true, reportantes: true },
    });
  }

  async listarPorUsuario(usuarioId) {
    return await prisma.reporteEvento.findMany({
      where: {
        OR: [
          { reportanteId: usuarioId },
          { reportantes: { some: { id: usuarioId } } },
        ],
      },
      include: { evento: true, reportantes: true },
    });
  }

  async removerReporte(id) {
    const existe = await this.reporteEventoRepository.buscarPorId(id);
    if (!existe) return false;
    this.reporteEventoRepository.remover(id);
    return true;
  }

  async listarEventosMaisReportados() {
    const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const reportesRecentes = await prisma.reporteEvento.findMany({
      where: { dataReporte: { gte: vinteQuatroHorasAtras } },
      include: { evento: true },
    });

    const contagem = {};

    for (const r of reportesRecentes) {
      const eventoId = r.eventoId;
      contagem[eventoId] = (contagem[eventoId] || 0) + r.qtdConfirmacoes;
    }

    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .map(([eventoId, total]) => ({
        eventoId: Number(eventoId),
        totalReportes: total,
      }));
  }
}

module.exports = ReporteService;

const ReporteService = require("../services/ReporteService");

class ReporteController {
  constructor() {
    this.reporteService = new ReporteService();
  }

  async criarOuConfirmarReporte(req, res) {
    const { usuarioId, evento, descricao = "" } = req.body;

    try {
      if (!usuarioId || !evento) {
        return res
          .status(400)
          .json({ erro: "Usuário e evento são obrigatórios!" });
      }

      const reporte = await this.reporteService.criarOuConfirmarReporte(
        usuarioId,
        evento,
        descricao,
      );
      res.status(201).json({
        mensagem: `Reporte sobre o evento "${evento.nome}" criado ou confirmado com sucesso!`,
        reporte,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao criar ou confirmar reporte: ${error.message}` });
    }
  }

  async listarReportes(req, res) {
    try {
      const reportes = await this.reporteService.listarReportes();
      res.status(200).json(reportes);
    } catch (error) {
      res
        .status(500)
        .json({ erro: `Erro ao listar reportes: ${error.message}` });
    }
  }

  async listarPorEvento(req, res) {
    const eventoId = Number(req.params.eventoId);

    try {
      if (!eventoId) {
        return res.status(400).json({ erro: "Evento ID é obrigatório." });
      }

      const reportes = await this.reporteService.listarPorEvento(eventoId);
      res.status(200).json(reportes);
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao listar reportes por evento: ${error.message}` });
    }
  }

  async listarPorUsuario(req, res) {
    const usuarioId = Number(req.params.usuarioId);

    try {
      if (!usuarioId) {
        return res.status(400).json({ erro: "Usuário ID é obrigatório." });
      }

      const reportes = await this.reporteService.listarPorUsuario(usuarioId);
      res.status(200).json(reportes);
    } catch (error) {
      res.status(400).json({
        erro: `Erro ao listar reportes por usuário: ${error.message}`,
      });
    }
  }

  async removerReporte(req, res) {
    const { id } = req.params;

    try {
      const removido = await this.reporteService.removerReporte(Number(id));
      if (!removido) {
        return res.status(404).json({ erro: "Reporte não encontrado." });
      }
      res.status(200).json({ mensagem: `Reporte ${id} removido com sucesso.` });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao remover reporte: ${error.message}` });
    }
  }

  async listarEventosMaisReportados(req, res) {
    try {
      const eventosMaisReportados =
        await this.reporteService.listarEventosMaisReportados();
      res.status(200).json(eventosMaisReportados);
    } catch (error) {
      res.status(400).json({
        erro: `Erro ao listar eventos mais reportados: ${error.message}`,
      });
    }
  }
}

module.exports = ReporteController;

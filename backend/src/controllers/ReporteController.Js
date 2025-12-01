const ReporteService = require("../services/ReporteService");

class ReporteController {
  constructor() {
    this.reporteService = new ReporteService();
  }

  criarOuConfirmarReporte(reportante, eventoInput, descricao = "") {
    try {
      const reporte = this.reporteService.criarOuConfirmarReporte(
        reportante,
        eventoInput,
        descricao,
      );
      console.log(
        `Reporte sobre o evento "${eventoInput.nome}" criado ou confirmado com sucesso!`,
      );
      return reporte;
    } catch (error) {
      console.error("Erro ao criar ou confirmar reporte:", error.message);
    }
  }

  listarReportes() {
    try {
      const reportes = this.reporteService.listarReportes();
      console.log("Reportes encontrados:");
      reportes.forEach((r) => {
        const eventoNome =
          r.evento?.nome || r.eventoInput?.nome || "Evento desconhecido";
        const reportantes = (r.reportantes || [r.reportante] || [])
          .map((u) => u.nome || u.id)
          .join(", ");
        console.log(
          `Reportante(s): ${reportantes}, Evento: ${eventoNome}, Descrição: ${r.descricao || ""}`,
        );
      });
      return reportes;
    } catch (error) {
      console.error("Erro ao listar reportes:", error.message);
    }
  }

  listarPorEvento(eventoId) {
    try {
      const reportes = this.reporteService.listarPorEvento(eventoId);
      console.log(`Reportes para o evento ID ${eventoId}:`, reportes.length);
      return reportes;
    } catch (error) {
      console.error("Erro ao listar reportes por evento:", error.message);
    }
  }

  listarPorUsuario(usuarioId) {
    try {
      const reportes = this.reporteService.listarPorUsuario(usuarioId);
      console.log(
        `Reportes feitos pelo usuário ID ${usuarioId}:`,
        reportes.length,
      );
      return reportes;
    } catch (error) {
      console.error("Erro ao listar reportes por usuário:", error.message);
    }
  }

  removerReporte(id) {
    try {
      const removido = this.reporteService.removerReporte(id);
      if (removido) console.log(`Reporte ${id} removido com sucesso.`);
      else console.log(`Reporte ${id} não encontrado.`);
      return removido;
    } catch (error) {
      console.error("Erro ao remover reporte:", error.message);
    }
  }

  listarEventosMaisReportados() {
    try {
      const eventos = this.reporteService.listarEventosMaisReportados();
      console.log("Eventos mais reportados:", eventos);
      return eventos;
    } catch (error) {
      console.error("Erro ao listar eventos mais reportados:", error.message);
    }
  }
}

module.exports = ReporteController;

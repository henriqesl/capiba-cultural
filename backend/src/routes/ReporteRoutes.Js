const express = require("express");
const router = express.Router();
const ReporteController = require("../controllers/ReporteController");

const reporteController = new ReporteController();

router.post("/", async (req, res) => {
  const { usuarioId, evento, descricao = "" } = req.body;

  try {
    if (!usuarioId || !evento) {
      return res
        .status(400)
        .json({ erro: "Usuário e evento são obrigatórios!" });
    }

    const resultado = await reporteController.criarOuConfirmarReporte(
      usuarioId,
      evento,
      descricao,
    );
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Erro ao criar ou confirmar reporte:", error.message);
    res.status(400).json({ erro: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const reportes = await reporteController.listarReportes();
    res.json(reportes);
  } catch (error) {
    console.error("Erro ao listar reportes:", error.message);
    res.status(500).json({ erro: error.message });
  }
});

router.get("/evento/:eventoId", async (req, res) => {
  const eventoId = Number(req.params.eventoId);

  try {
    if (!eventoId) throw new Error("Evento ID é obrigatório.");

    const reportes = await reporteController.listarPorEvento(eventoId);
    res.json(reportes);
  } catch (error) {
    console.error("Erro ao listar reportes por evento:", error.message);
    res.status(400).json({ erro: error.message });
  }
});

router.get("/usuario/:usuarioId", async (req, res) => {
  const usuarioId = Number(req.params.usuarioId);

  try {
    if (!usuarioId) throw new Error("Usuário ID é obrigatório.");

    const reportes = await reporteController.listarPorUsuario(usuarioId);
    res.json(reportes);
  } catch (error) {
    console.error("Erro ao listar reportes por usuário:", error.message);
    res.status(400).json({ erro: error.message });
  }
});

router.get("/mais-reportados", async (req, res) => {
  try {
    const maisReportados =
      await reporteController.listarEventosMaisReportados();
    res.json(maisReportados);
  } catch (error) {
    console.error("Erro ao listar eventos mais reportados:", error.message);
    res.status(400).json({ erro: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    if (!id) throw new Error("ID do reporte é obrigatório.");

    const removido = await reporteController.removerReporte(id);
    if (!removido) {
      return res.status(404).json({ erro: "Reporte não encontrado" });
    }
    res.json({ mensagem: "Reporte removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover reporte:", error.message);
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;

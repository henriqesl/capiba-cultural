const checkInService = require("../services/CheckInService");

class CheckInController {
  async realizarCheckIn(req, res) {
    try {
      const usuarioId = req.usuarioId;
      const { eventoId } = req.body;

      const resultado = await checkInService.realizarCheckIn(
        Number(usuarioId),
        Number(eventoId),
      );

      return res.status(200).json(resultado);
    } catch (error) {
      console.error("Erro CheckIn:", error);
      return res.status(400).json({ erro: error.message });
    }
  }

  async listarHistorico(req, res) {
    try {
      const { usuarioId } = req.params;

      if (!usuarioId) {
        return res.status(400).json({ erro: "ID do usuário obrigatório" });
      }

      const historico = await checkInService.listarHistorico(Number(usuarioId));
      return res.json(historico);
    } catch (error) {
      console.error("Erro ao listar histórico:", error);
      return res.status(500).json({ erro: "Erro ao buscar histórico." });
    }
  }
}

module.exports = CheckInController;

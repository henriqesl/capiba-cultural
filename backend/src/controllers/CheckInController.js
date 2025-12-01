const checkInService = require("../services/CheckInService");

class CheckInController {
  async realizarCheckIn(req, res) {
    const usuarioId = req.usuarioId;
    const { eventoId } = req.body;

    try {
      if (!eventoId) {
        return res.status(400).json({ erro: "ID do evento é obrigatório." });
      }

      const resultado = await checkInService.realizarCheckIn(
        usuarioId,
        Number(eventoId)
      );

      res.status(200).json({
        mensagem: "Check-in realizado com sucesso!",
        moedasGanhas: resultado.moedasGanhas,
        checkIn: resultado.checkIn,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro no Check-in: ${error.message}` });
    }
  }
}

module.exports = CheckInController;

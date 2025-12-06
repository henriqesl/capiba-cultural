const checkInService = require("../services/CheckInService");

class CheckInController {
  async realizarCheckIn(req, res) {
    const usuarioId = req.usuarioId;
    const { eventoId } = req.body;

  async realizarCheckIn(req, res) {
    try {
      const usuarioId = req.usuarioId; 
      const { eventoId } = req.body;

      const resultado = await checkInService.realizarCheckIn(
        usuarioId,
        Number(eventoId)
      );

      return res.status(200).json({
        mensagem: "Check-in realizado com sucesso",
        ...resultado
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = CheckInController;

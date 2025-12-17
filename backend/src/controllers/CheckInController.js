const checkInService = require("../services/CheckInService");

class CheckInController {
  async realizarCheckIn(req, res) {
    try {
      const usuarioId = req.usuarioId; 
      const { eventoId } = req.body;

      // Converte para Number para segurança
      const resultado = await checkInService.realizarCheckIn(
        Number(usuarioId),
        Number(eventoId)
      );

      return res.status(200).json({
        mensagem: "Check-in realizado com sucesso",
        ...resultado, // Retorna moedasGanhas
      });
    } catch (error) {
      console.error("Erro CheckIn:", error.message);
      return res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = CheckInController; // Exporta a Classe (Routes faz o new)
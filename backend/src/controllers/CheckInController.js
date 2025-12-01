const checkInService = require('../services/CheckInService');

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

            
        return res.status(200).json({
            mensagem: "Check-in realizado com sucesso!",
            moedasGanhas: resultado.moedasGanhas,
            checkInLocal: resultado.checkInLocal,
            conecta: resultado.conecta
        });
        } catch (error) {
            console.error("Erro no Check-in:", error.message);
            return res.status(400).json({ erro: error.message });
            }
        }
}


module.exports = CheckInController;
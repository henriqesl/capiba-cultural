const checkInService = require('../services/CheckInService');

class CheckInController {

    async realizarCheckIn(usuarioId, eventoId) {
        try {
            if (!eventoId) throw new Error("ID do evento é obrigatório.");

            const resultado = await checkInService.realizarCheckIn(usuarioId, Number(eventoId));

            return resultado;

        } catch (error) {
            console.error("Erro no Check-in:", error.message);
            throw error; 
        }
    }
}

module.exports = CheckInController;
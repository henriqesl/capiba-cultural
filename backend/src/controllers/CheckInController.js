const checkInService = require('../services/CheckInService');
const conecta = require("../services/ConectaAPI");
const usuarioService = require("../services/UsuarioService");
const eventoService = require("../services/EventoService");

class CheckInController {

    async realizarCheckIn(usuarioId, eventoId) {
        try {
            if (!eventoId) throw new Error("ID do evento é obrigatório.");

            const resultado = await checkInService.realizarCheckIn(usuarioId, Number(eventoId));

            const usuario = await usuarioService.obterPorId(usuarioId);
            const evento  = await eventoService.obterPorId(eventoId);

            await conecta.autenticar(usuario.cpf, usuario.senha);  

                const dados = {
                    userIdentifier: usuario.cpf,   // obrigatório
                    eventName: evento.nome,        // obrigatório
                    checkInDateTime: new Date().toISOString(),
                    cidade: "Recife",              // vocês podem pegar via Evento também
                    bairro: "Centro",
                    rua: evento.local,
                    identifier: `EVENTO-${eventoId}-USER-${usuarioId}`,
                    document: usuario.cpf
            };


            const respostaConecta = await conecta.fazerCheckIn(dados);


            return {
                checkInLocal: resultado,
                conecta: respostaConecta
            };


        } catch (error) {
            console.error("Erro no Check-in:", error.message);
            throw error; 
        }
    }
}

module.exports = CheckInController;
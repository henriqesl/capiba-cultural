const EventoService = require('../EventoService');
const UsuarioService = require('../UsuarioService');
const CheckIn = require('../models/CheckIn')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ConectaAPI = require('./ConectaAPI');

class CheckInService {
    constructor() {
        this.eventoRepository = new EventoService();
        this.usuarioRepository = new UsuarioService();
        this.checkInRepository = new CheckIn();
        this.conectaRepository = new ConectaAPI();
    }

    async realizarCheckIn(usuarioId, eventoId) {
        const usuario = await this.usuarioRepository.obterPorId(usuarioId);
        if (!usuario) throw new Error("Usuário não encontrado");

        const evento = await this.eventoRepository.obterPorId(eventoId);
        if (!evento) throw new Error("Evento não encontrado");

        this.conectaRepository.setToken(tokenConecta);

        const dadosConecta = {
            userIdentifier: usuario.cpf,
            eventName: evento.nome,
            checkInDateTime: new Date().toISOString(),
            cidade: "Recife",
            bairro: "Centro",
            rua: evento.local,
            identifier: `EVENTO-${evento.id}-USER-${usuario.id}`,
            document: usuario.cpf
        };

        await this.conectaRepository.fazerCheckIn(dadosConecta);

        const moedasGanhas = evento.pequenoPorte ? 10 : 20;
        await this.usuarioRepository.adicionarMoedas(usuarioId, moedasGanhas);

        return { moedasGanhas };
    }
}

module.exports = new CheckInService();
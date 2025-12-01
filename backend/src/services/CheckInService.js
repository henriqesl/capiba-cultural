const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CheckInModel = require("../models/CheckIn");
const EventoModel = require("../models/Evento");

class CheckInService {
  constructor() {
    this.checkInRepository = new CheckInModel();
    this.eventoRepository = new EventoModel();
  }

  async realizarCheckIn(usuarioId, eventoId) {
    const evento = await this.eventoRepository.obterPorId(eventoId);
    if (!evento) {
      throw new Error("Evento inválido ou não encontrado.");
    }

    const checkInExistente =
      await this.checkInRepository.buscarPorUsuarioEEvento(usuarioId, eventoId);

    if (checkInExistente) {
      throw new Error("Você já realizou o check-in neste evento.");
    }

    const resultado = await prisma.$transaction(async (tx) => {
      // A. Cria o registro do check-in
      const novoCheckIn = await tx.checkIn.create({
        data: { usuarioId, eventoId },
      });

      const moedasGanhas = evento.moedasDistribuidas || 10;

      await tx.usuario.update({
        where: { id: usuarioId },
        data: {
          saldoMoedaCapiba: { increment: moedasGanhas },
        },
      });

      return { checkIn: novoCheckIn, moedasGanhas };
    });

    return resultado;
  }
}

module.exports = new CheckInService();

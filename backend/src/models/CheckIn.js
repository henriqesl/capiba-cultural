const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CheckIn {
  async criar(usuarioId, eventoId) {
    return await prisma.checkIn.create({
      data: {
        usuarioId: usuarioId,
        eventoId: eventoId,
        data: new Date()
      },
      include: {
        evento: true 
      }
    });
  }

  async verificarCheckInExistente(usuarioId, eventoId) {
    return await prisma.checkIn.findFirst({
      where: {
        usuarioId: usuarioId,
        eventoId: eventoId
      }
    });
  }

  async listarPorUsuario(usuarioId) {
    return await prisma.checkIn.findMany({
      where: { usuarioId },
      include: { evento: true },
      orderBy: { data: "desc" },
    });
  }
}

module.exports = CheckIn;
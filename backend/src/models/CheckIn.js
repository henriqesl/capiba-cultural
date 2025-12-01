const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CheckIn {
  async buscarPorUsuarioEEvento(usuarioId, eventoId) {
    return await prisma.checkIn.findUnique({
      where: {
        usuarioId_eventoId: { usuarioId, eventoId },
      },
    });
  }

  async listarPorUsuario(usuarioId) {
    return await prisma.checkIn.findMany({
      where: { usuarioId },
      include: { evento: true },
      orderBy: { data: "desc" },
    });
  }

  async criar(usuarioId, eventoId) {
    return await prisma.checkIn.create({
      data: { usuarioId, eventoId },
    });
  }
}

module.exports = CheckIn;

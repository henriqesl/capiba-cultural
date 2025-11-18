const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Caravana {
  async criar(nome, eventoId, bonusPorParticipante = 10) {
    if (!nome) throw new Error("Nome da caravana é obrigatório");

    const novaCaravana = await prisma.caravana.create({
      data: {
        nome,
        eventoId,
        bonusPorParticipante
      }
    });

    return novaCaravana;
  }

  async listar() {
    return await prisma.caravana.findMany({
      include: { membros: true, eventoDestino: true }
    });
  }

  async obterPorId(id) {
    const caravana = await prisma.caravana.findUnique({
      where: { id },
      include: { membros: true, eventoDestino: true }
    });

    if (!caravana) throw new Error("Caravana não encontrada");
    return caravana;
  }

  async atualizar(id, novosDados) {
    return await prisma.caravana.update({
      where: { id },
      data: novosDados
    });
  }

  async adicionarMembro(caravanaId, usuarioId) {
    return await prisma.caravana.update({
      where: { id: caravanaId },
      data: {
        membros: { connect: { id: usuarioId } }
      },
      include: { membros: true }
    });
  }

  async remover(id) {
    return await prisma.caravana.delete({
      where: { id }
    });
  }
}

module.exports = Caravana;

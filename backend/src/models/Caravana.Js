const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Caravana {
  async criarCaravana(nome, eventoId = null, bonusPorParticipante = 10, descricao = "Caravana sem descrição") {
    if (!nome) throw new Error("Nome da caravana é obrigatório");
    return await prisma.caravana.create({
      data: {
        nome,
        eventoId,
        bonusPorParticipante,
        descricao
      }
    });

  }


  async listar() {
    return await prisma.caravana.findMany({
      include: { membros: true, eventoDestino: true }
    });
  }

  async obterPorId(id) {
    return await prisma.caravana.findUnique({
      where: { id },
      include: { membros: true, eventoDestino: true }
    });
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

    async adicionarDestino(caravanaId, eventoId) {
        return await prisma.caravana.update({
            where: { id: caravanaId },
            data: { eventoId: eventoId },
            include: { evento: true, membros: true }

        });
    }

  async getMembros(id) { 
    return await prisma.grupoCompeticao.findUnique({
        where: { id: id },
        select: { membros: true }
    });
  }

    async setMembros(id, list) { 
      return await prisma.grupoCompeticao.update({
          where: { id: id },
          data: { membros: list }, 
          select: { membros: true }
        });
    }

    
}

module.exports = Caravana;

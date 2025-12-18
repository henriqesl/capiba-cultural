const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Missao {
  async listar() {
    return prisma.missao.findMany();
  }

  async statusUsuario(usuarioId) {
    const resultados = await prisma.statusUsuario.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: {
        missao: true, // FAZ O JOIN COM A TABELA MISSAO
      },
    });

    // Mapeamos para "achatar" o objeto e facilitar a vida do React
    return resultados.map(item => ({
      id: item.id,
      progressoAtual: item.progressoAtual,
      concluida: item.concluida,
      // Pegamos os dados de dentro do objeto 'missao'
      titulo: item.missao.titulo,
      descricao: item.missao.descricao,
      recompensa: item.missao.recompensaCapibas,
      meta: item.missao.valorRequisito,
    }));
  }

  async atualizarStatus(missaoId, usuarioId, progressoAtual, isConcluida) {
    return prisma.statusUsuario.upsert({
      where: {
        missaoId_usuarioId: {
          missaoId,
          usuarioId,
        },
      },
      update: {
        progressoAtual,
        concluida: isConcluida,
        dataConclusao: isConcluida ? new Date() : null,
      },
      create: {
        missaoId,
        usuarioId,
        progressoAtual,
        concluida: isConcluida,
        dataConclusao: isConcluida ? new Date() : null,
      },
    });
  }

  async contarTotalCheckins(usuarioId) {
    return prisma.checkIn.count({ where: { usuarioId } });
  }

  async contaLocaisUnicos(usuarioId) {
    const checkinsUnicos = await prisma.checkIn.groupBy({
      by: ["eventoId"],
      where: { usuarioId },
    });
    return checkinsUnicos.length;
  }

  async contarCheckinsPorTag(usuarioId, tag) {
    return prisma.checkIn.count({
      where: {
        usuarioId,
        evento: { categoria: tag },
      },
    });
  }

  async adicionarCapibas(usuarioId, capibasAcumuladas) {
    return prisma.usuario.update({
      where: { id: usuarioId },
      data: { saldoCapiba: { increment: capibasAcumuladas } },
    });
  }
}

module.exports = Missao;

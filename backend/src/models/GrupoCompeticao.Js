const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Usuario = require("./Usuario");

class GrupoCompeticao {
  async novoGrupoCompeticao(
    nome,
    dataInicio,
    dataFim,
    encerrado = false,
    pontuacaoTotal = 0,
    participantesIds = []
  ) {
    return await prisma.grupoCompeticao.create({
      data: {
        nome,
        dataInicio:
          dataInicio instanceof Date ? dataInicio : new Date(dataInicio),
        dataFim: dataFim instanceof Date ? dataFim : new Date(dataFim),
        encerrado,
        pontuacaoTotal,
        vencedorId: null,

        membros: participantesIds.length
          ? { connect: participantesIds.map((id) => ({ id })) }
          : undefined,
      },

      include: {
        membros: true,
      },
    });
  }

  async listar() {
    return await prisma.grupoCompeticao.findMany({
      include: { membros: true },
    });
  }

  async obterPorId(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      include: { membros: true },
    });
  }

  async removerGrupo(id) {
    return await this.prisma.grupoCompeticao.delete({
      where: { id: id },
    });
  }

  async adicionarMembro(grupoId, usuarioId) {
    return await prisma.grupoCompeticao.update({
      where: { id: grupoId },
      data: {
        membros: { connect: { id: usuarioId } },
      },
      include: { membros: true },
    });
  }

  async getMembros(grupoId) {
    const grupo = await prisma.grupoCompeticao.findUnique({
      where: { id: grupoId },
      include: { membros: true },
    });
    return grupo?.membros || [];
  }

  async getNome(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { nome: true },
    });
  }

  async setNome(id, value) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { nome: value },
      select: { nome: true },
    });
  }

  async getMembros(grupoId) {
    const grupo = await prisma.grupoCompeticao.findUnique({
      where: { id: grupoId },
      include: { membros: true },
    });
    return grupo?.membros || [];
  }

  async setMembros(id, list) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { membros: list },
      select: { membros: true },
    });
  }

  async getDataInicio(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { dataInicio: true },
    });
  }

  async setDataInicio(id, value) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { dataInicio: value },
      select: { dataInicio: true },
    });
  }

  async getDataFim(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { dataFim: true },
    });
  }

  async setDataFim(id, value) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { dataFim: value },
      select: { dataFim: true },
    });
  }

  async getEncerrado(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { encerrado: true },
    });
  }

  async setEncerrado(id, value) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { encerrado: value },
      select: { encerrado: true },
    });
  }

  async getPontuacaoTotal(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { pontuacaoTotal: true },
    });
  }

  async setPontuacaoTotal(id, value) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { pontuacaoTotal: value },
      select: { pontuacaoTotal: true },
    });
  }

  async getVencedor(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { vencedor: true },
    });
  }

  async setVencedor(id, vencedorId) {
    return await prisma.grupoCompeticao.update({
      where: { id },
      data: {
        vencedorId: vencedorId,
      },
      include: { vencedor: true },
    });
  }

  async obterGrupoPorUsuarioId(usuarioId) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { grupoCompeticaoId: true },
    });

    if (!usuario || !usuario.grupoCompeticaoId) {
      return null;
    }

    return await prisma.grupoCompeticao.findUnique({
      where: { id: usuario.grupoCompeticaoId },
      select: { id: true, encerrado: true },
    });
  }

  async incrementarPontuacao(grupoId, valor) {
    return await prisma.grupoCompeticao.update({
      where: { id: grupoId },
      data: {
        pontuacaoTotal: {
          increment: valor,
        },
      },
      select: { id: true, pontuacaoTotal: true },
    });
  }
}
module.exports = GrupoCompeticao;

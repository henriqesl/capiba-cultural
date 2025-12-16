const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Caravana {
async criarCaravana(
    nome,
    codigoAcesso,
    eventoId,
    bonusPorParticipante,
    descricao,
    usuarioId,
    imagemUrl
  ) {

    return await prisma.caravana.create({
      data: {
        nome,
        codigoAcesso,
        bonusPorParticipante,
        descricao, 
        criadorId: usuarioId,
        imagemUrl: "",

        membros: {
          connect: { id: usuarioId }
        },
        
        ...(eventoId && {
          evento: { connect: { id: eventoId } }
        })
      },
      include: {
        membros: true,
        evento: true
      }
    });
  }


  async listar() {
    return await prisma.caravana.findMany({
      include: { membros: true, evento: true },
    });
  }

  async obterPorId(id) {
    return await prisma.caravana.findUnique({
      where: { id },
      include: { membros: true, evento: true },
    });
  }

  async atualizar(id, novosDados) {
    return await prisma.caravana.update({
      where: { id },
      data: novosDados,
    });
  }




  async listarPorUsuario(usuarioId) {
  return await prisma.caravana.findMany({
    where: {
      membros: {
        some: {
          id: usuarioId
        }
      }
    },
    include: {
      membros: true,
      evento: true
    }
  });
}

  async remover(id) {
    return await prisma.caravana.delete({
      where: { id },
    });
  }

  async adicionarDestino(caravanaId, eventoId) {
    return await prisma.caravana.update({
      where: { id: caravanaId },
      data: {
        eventoId: eventoId,
      },
      include: {
        evento: true,
        membros: true,
      },
    });
  }

 async obterPorCodigoAcesso(codigoAcesso) {
    if (!codigoAcesso) throw new Error("Código de acesso é obrigatório.");

    try {
      console.log("Consultando caravana com código:", codigoAcesso);  // Log de busca

      const caravana = await prisma.caravana.findUnique({
        where: { codigoAcesso },
        include: { membros: true },
      });

      if (!caravana) {
        console.log("Caravana não encontrada com esse código:", codigoAcesso); // Log de erro
      }

      return caravana;

    } catch (error) {
      console.error("Erro ao consultar caravana por código de acesso:", error);
      throw error;
    }
  }

  async adicionarMembro(caravanaId, usuarioId) {
    try {
      console.log(`Adicionando usuário ${usuarioId} à caravana ${caravanaId}`); // Log de adição de membro

      return await prisma.caravana.update({
        where: { id: caravanaId },
        data: {
          membros: { connect: { id: usuarioId } },
        },
        include: { membros: true },
      });
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      throw error;
    }
  }



  async getMembros(id) {
    return await prisma.grupoCompeticao.findUnique({
      where: { id: id },
      select: { membros: true },
    });
  }

  async setMembros(id, list) {
    return await prisma.grupoCompeticao.update({
      where: { id: id },
      data: { membros: list },
      select: { membros: true },
    });
  }
}

module.exports = Caravana;

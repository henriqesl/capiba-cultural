const Caravana = require("../models/Caravana");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CaravanaService {
  constructor() {
    this.caravanaRepository = new Caravana();
  }

  async criarCaravana(nome, codigoAcesso, eventoId = null, bonusPorParticipante = 10, descricao, usuarioId) {
    if (!nome) {
      throw new Error("Nome da caravana é obrigatório.");
    }

    const novaCaravana = await this.caravanaRepository.criarCaravana(
      nome,
      codigoAcesso,
      eventoId,
      bonusPorParticipante,
      descricao,
      usuarioId 
    );

    return novaCaravana;
  }


  async listarCaravanas() {
    return await this.caravanaRepository.listar();
  }

  async obterPorId(id) {
    const caravana = await this.caravanaRepository.obterPorId(id);
    if (!caravana) throw new Error("Caravana não encontrada");

    return caravana;
  }

  async adicionarMembro(caravanaId, usuarioId) {
    const caravana = await this.caravanaRepository.obterPorId(caravanaId);
    if (!caravana) throw new Error("Grupo não encontrado.");

    const membros = caravana.membros.map((m) => m.id);
    if (membros.includes(usuarioId)) {
      throw new Error("Usuário já faz parte da caravana.");
    }

    await this.caravanaRepository.adicionarMembro(caravanaId, usuarioId);
    return await this.caravanaRepository.obterPorId(caravanaId);
  }

  async adicionarDestino(caravanaId, eventoId) {
    return await this.caravanaRepository.adicionarDestino(caravanaId, eventoId);
  }

  async listarPorUsuario(usuarioId) {
      return await this.caravanaRepository.listarPorUsuario(usuarioId);
  }


 
  
   async entrarComCodigoAcesso(codigoAcesso, usuarioId) {
    if (!codigoAcesso || !usuarioId) {
      throw new Error("Código de acesso e usuário são obrigatórios");
    }

    try {
      console.log("Procurando caravana pelo código de acesso:", codigoAcesso);  // Log de entrada

      const caravana = await this.caravanaRepository.obterPorCodigoAcesso(codigoAcesso);

      if (!caravana) {
        throw new Error("Caravana não encontrada");
      }

      console.log("Caravana encontrada:", caravana);  // Log de sucesso

      const jaParticipa = caravana.membros.some((m) => m.id === usuarioId);
      if (jaParticipa) {
        throw new Error("Usuário já participa da caravana");
      }

      const caravanaAtualizada = await this.caravanaRepository.adicionarMembro(caravana.id, usuarioId);

      console.log("Caravana atualizada com novo membro:", caravanaAtualizada); // Log de sucesso

      return caravanaAtualizada;

    } catch (error) {
      console.error("Erro no service ao tentar entrar com código de acesso:", error);
      throw error;
    }
  }

  async removerCaravana(id) {
    return await this.caravanaRepository.remover(id);
  }

  async calcularMultiplicador(
    usuarioIdParam,
    caravanaIdParam,
    mesParam,
    anoParam,
  ) {
    const usuarioId = Number(usuarioIdParam);
    const caravanaId = Number(caravanaIdParam);

    const now = new Date();
    const mes = mesParam ? Number(mesParam) : now.getMonth() + 1;
    const ano = anoParam ? Number(anoParam) : now.getFullYear();

    if (!Number.isInteger(usuarioId) || !Number.isInteger(caravanaId)) {
      throw new Error("usuarioId e caravanaId devem ser números inteiros.");
    }

    const caravana = await this.caravanaRepository.obterPorId(caravanaId);
    if (!caravana) throw new Error("Caravana não encontrada");

    const tamanho = (caravana.membros || []).length;
    let bonusTamanho = 0;
    if (tamanho >= 6 && tamanho <= 10) bonusTamanho = 5;
    else if (tamanho >= 11 && tamanho <= 15) bonusTamanho = 10;
    else if (tamanho > 15) bonusTamanho = 12;

    const start = new Date(ano, mes - 1, 1);
    const end = new Date(ano, mes, 1);

    const eventosDoMes = await prisma.evento.findMany({
      where: {
        data: { gte: start, lt: end },
        caravanas: { some: { id: caravanaId } },
      },
      include: { participantes: true },
    });

    let incrementoMensal = 0;
    for (const evento of eventosDoMes) {
      if (
        evento.participantes &&
        evento.participantes.some((u) => u.id === usuarioId)
      ) {
        incrementoMensal = 5;
        break;
      }
    }

    const multiplicador = 100 + bonusTamanho + incrementoMensal;
    return Math.ceil(multiplicador);
  }
}

module.exports = new CaravanaService();

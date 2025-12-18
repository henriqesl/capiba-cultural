const Missao = require("../models/Missao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MissaoService {
  constructor() {
    this.missaoRepository = new Missao();
  }

  async criarMissao(dados) {
    if (!dados.titulo || !dados.recompensaCapibas || !dados.valorRequisito) {
      throw new Error("Campos obrigatórios: Título, Recompensa e Meta.");
    }

    return await prisma.missao.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        recompensaCapibas: Number(dados.recompensaCapibas),
        tipoRequisito: dados.tipoRequisito || "COUNT_CHECKINS",
        valorRequisito: Number(dados.valorRequisito),
        tagRequisito: dados.tagRequisito || null,
      },
    });
  }

  async listarMissoesComProgresso(usuarioId) {
    const missoes = await prisma.missao.findMany({
      include: {
        progressos: {
          where: { usuarioId: Number(usuarioId) },
        },
      },
      orderBy: { id: "asc" },
    });

    return missoes.map((m) => {
      const status = m.progressos[0];
      return {
        id: m.id,
        titulo: m.titulo,
        descricao: m.descricao,
        recompensa: m.recompensaCapibas,
        meta: m.valorRequisito,
        progressoAtual: status ? status.progressoAtual : 0,
        completada: status ? status.concluida : false,
      };
    });
  }

  async processarProgresso(usuarioId, tipoAcaoString, eventoAtual = null) {
    try {
      const missoes = await prisma.missao.findMany();
      if (!missoes.length) return;

      const UsuarioServiceClass = require("./UsuarioService");
      const usuarioService = new UsuarioServiceClass();

      for (const missao of missoes) {
        let deveProcessar = false;
        let incremento = 0;
        let valorAbsoluto = null;

        if (
          missao.tipoRequisito === "COUNT_CHECKINS" &&
          tipoAcaoString === "CHECKIN"
        ) {
          deveProcessar = true;
          incremento = 1;
        } else if (
          missao.tipoRequisito === "SPECIFIC_TAG" &&
          tipoAcaoString === "CHECKIN" &&
          eventoAtual
        ) {
          if (
            eventoAtual.categoria &&
            missao.tagRequisito &&
            eventoAtual.categoria.toUpperCase() ===
              missao.tagRequisito.toUpperCase()
          ) {
            deveProcessar = true;
            incremento = 1;
          }
        } else if (
          missao.tipoRequisito === "UNIQUE_LOCATIONS" &&
          tipoAcaoString === "CHECKIN"
        ) {
          deveProcessar = true;
          const locais = await prisma.checkIn.groupBy({
            by: ["eventoId"],
            where: { usuarioId: usuarioId },
          });
          valorAbsoluto = locais.length;
        }

        if (!deveProcessar) continue;

        let status = await prisma.statusUsuario.findUnique({
          where: { usuarioId_missaoId: { usuarioId, missaoId: missao.id } },
        });

        if (!status) {
          status = await prisma.statusUsuario.create({
            data: {
              usuarioId,
              missaoId: missao.id,
              progressoAtual: 0,
              concluida: false,
            },
          });
        }

        if (status.concluida) continue;

        const novoValor =
          valorAbsoluto !== null
            ? valorAbsoluto
            : status.progressoAtual + incremento;
        const completou = novoValor >= missao.valorRequisito;

        await prisma.statusUsuario.update({
          where: { id: status.id },
          data: {
            progressoAtual: novoValor,
            concluida: completou,
            dataConclusao: completou ? new Date() : null,
          },
        });

        if (completou) {
          await usuarioService.adicionarMoedas(
            usuarioId,
            missao.recompensaCapibas,
          );
          console.log(
            `🎉 Usuário ${usuarioId} completou missão: ${missao.titulo}`,
          );
        }
      }
    } catch (error) {
      console.error("Erro gamificação:", error);
    }
  }
}

module.exports = MissaoService;

const Missao = require("../models/Missao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MissaoService {
  constructor() {
    this.missaoRepository = new Missao();
  }

  // Processa o progresso de qualquer tipo de missão (CHECKIN, CARAVANA, etc)
  async processarProgresso(usuarioId, tipoAcao) {
    try {
      // 1. Busca todas as missões ativas desse tipo
      const missoes = await prisma.missao.findMany({
        where: {
          tipo: tipoAcao,
          ativa: true
        }
      });

      if (!missoes.length) return;

      const UsuarioServiceClass = require("./UsuarioService");
      const usuarioService = new UsuarioServiceClass();

      for (const missao of missoes) {
        // 2. Busca ou cria o progresso do usuário nesta missão
        let progresso = await prisma.progressoMissao.findFirst({
          where: {
            usuarioId: usuarioId,
            missaoId: missao.id
          }
        });

        if (!progresso) {
          progresso = await prisma.progressoMissao.create({
            data: {
              usuarioId,
              missaoId: missao.id,
              progressoAtual: 0,
              completada: false
            }
          });
        }

        // Se já completou, pula
        if (progresso.completada) continue;

        // 3. Incrementa o progresso
        const novoValor = progresso.progressoAtual + 1;
        const completouAgora = novoValor >= missao.meta;

        await prisma.progressoMissao.update({
          where: { id: progresso.id },
          data: {
            progressoAtual: novoValor,
            completada: completouAgora,
            dataConclusao: completouAgora ? new Date() : null
          }
        });

        // 4. Se completou, dá a recompensa extra!
        if (completouAgora) {
          console.log(`🎉 Usuário ${usuarioId} completou a missão: ${missao.titulo}`);
          await usuarioService.adicionarMoedas(usuarioId, missao.recompensa);
        }
      }
    } catch (error) {
      console.error("Erro ao processar missões:", error);
      // Não damos throw para não travar o fluxo principal (check-in)
    }
  }

  async criarMissao(titulo, descricao, recompensa, meta, tipo, expiraEm) {
    return await this.missaoRepository.novaMissao(
      titulo,
      descricao,
      recompensa,
      meta,
      tipo,
      expiraEm
    );
  }

  // Lista missões com o progresso do usuário embutido
  async listarMissoesComProgresso(usuarioId) {
    const missoes = await prisma.missao.findMany({
      where: { ativa: true },
      include: {
        progressos: {
          where: { usuarioId: Number(usuarioId) }
        }
      }
    });

    // Formata para o frontend
    return missoes.map(m => {
      const prog = m.progressos[0];
      return {
        ...m,
        progressoAtual: prog ? prog.progressoAtual : 0,
        completada: prog ? prog.completada : false
      };
    });
  }

  async obterPorId(id) {
    const missao = await this.missaoRepository.obterPorId(id);
    if (!missao) throw new Error("Missão não encontrada");
    return missao;
  }

  async removerMissao(id) {
    return await this.missaoRepository.removerMissao(id);
  }
}

module.exports = MissaoService;
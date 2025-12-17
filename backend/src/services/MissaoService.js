const Missao = require("../models/Missao");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MissaoService {
  constructor() {
    this.missaoRepository = new Missao();
  }

  // Lógica principal: Busca TODAS as missões globais e anexa o status do usuário
  async listarMissoesComProgresso(usuarioId) {
    // 1. Busca todas as missões no banco
    const missoes = await prisma.missao.findMany({
      include: {
        // Inclui APENAS o progresso deste usuário específico
        progressos: { 
          where: { usuarioId: Number(usuarioId) }
        }
      },
      orderBy: { id: 'asc' }
    });

    // 2. Formata para o frontend
    return missoes.map(m => {
      // Se tiver progresso, pega o primeiro (e único). Se não, assume 0.
      const status = m.progressos[0]; 
      
      return {
        id: m.id,
        titulo: m.titulo,
        descricao: m.descricao,
        recompensa: m.recompensaCapibas,
        meta: m.valorRequisito,
        // Aqui está a mágica: Mostra o progresso individual ou 0 se nunca começou
        progressoAtual: status ? status.progressoAtual : 0,
        completada: status ? status.concluida : false
      };
    });
  }

  async processarProgresso(usuarioId, tipoAcaoString, eventoAtual = null) {
     // ... (Código da gamificação que te passei antes) ...
     // Se precisar dele completo me avise, mas o foco agora é a listagem
      try {
      const missoes = await prisma.missao.findMany();
      if (!missoes.length) return;

      const UsuarioServiceClass = require("./UsuarioService");
      const usuarioService = new UsuarioServiceClass();

      for (const missao of missoes) {
        let deveProcessar = false;
        let incremento = 0;
        let valorAbsoluto = null;

        if (missao.tipoRequisito === 'COUNT_CHECKINS' && tipoAcaoString === 'CHECKIN') {
            deveProcessar = true;
            incremento = 1;
        } else if (missao.tipoRequisito === 'SPECIFIC_TAG' && tipoAcaoString === 'CHECKIN' && eventoAtual) {
            if (eventoAtual.categoria && missao.tagRequisito && 
                eventoAtual.categoria.toUpperCase() === missao.tagRequisito.toUpperCase()) {
                deveProcessar = true;
                incremento = 1;
            }
        } else if (missao.tipoRequisito === 'UNIQUE_LOCATIONS' && tipoAcaoString === 'CHECKIN') {
            deveProcessar = true;
            const locais = await prisma.checkIn.groupBy({
                by: ['eventoId'],
                where: { usuarioId: usuarioId }
            });
            valorAbsoluto = locais.length; 
        }

        if (!deveProcessar) continue;

        let status = await prisma.statusUsuario.findUnique({
          where: { usuarioId_missaoId: { usuarioId, missaoId: missao.id } }
        });

        if (!status) {
          status = await prisma.statusUsuario.create({
            data: { usuarioId, missaoId: missao.id, progressoAtual: 0, concluida: false }
          });
        }

        if (status.concluida) continue;

        const novoValor = (valorAbsoluto !== null) ? valorAbsoluto : (status.progressoAtual + incremento);
        const completou = novoValor >= missao.valorRequisito;

        await prisma.statusUsuario.update({
          where: { id: status.id },
          data: {
            progressoAtual: novoValor,
            concluida: completou,
            dataConclusao: completou ? new Date() : null
          }
        });

        if (completou) {
            await usuarioService.adicionarMoedas(usuarioId, missao.recompensaCapibas);
        }
      }
    } catch (error) {
      console.error("Erro gamificação:", error);
    }
  }

  async listarMissoesComProgresso(usuarioId) {
    console.log(`🤖 Service buscando missões para User ${usuarioId}`);
    
    // Busca missões e inclui 'progressos' (conforme seu schema.prisma)
    const missoes = await prisma.missao.findMany({
      include: {
        progressos: { 
          where: { usuarioId: Number(usuarioId) }
        }
      },
      orderBy: { id: 'asc' }
    });

    console.log(`🤖 Encontradas ${missoes.length} missões no banco.`);

    return missoes.map(m => {
      const status = m.progressos[0]; // Pega o primeiro (e único) status para esse user
      return {
        id: m.id,
        titulo: m.titulo,
        descricao: m.descricao,
        recompensa: m.recompensaCapibas,
        meta: m.valorRequisito,
        progressoAtual: status ? status.progressoAtual : 0,
        completada: status ? status.concluida : false
      };
    });
  }
}

module.exports = MissaoService;
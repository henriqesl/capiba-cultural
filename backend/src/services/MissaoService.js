const Missao = require('../models/Missao');
const { TipoMissao } = require('@prisma/client'); 

class MissaoService {
  constructor() {
    this.missaoRepository = new Missao();
  }


    async buscarStatusUsuario(userId) {
        const missoes = await missaoRepository.listar();
        const listaStatus = await missaoRepository.statusUsuario(userId);

        const statusMissaoFormatado = missoes.map(missao => {
            const status = statusList.find(s => s.missaoId === missao.id);

            return {
                id: missao.id,
                titulo: missao.titulo,
                progressoAtual: status ? status.progressoAtual : 0,
                concluida: status ? status.concluida : false,
            };
        });

        return statusMissaoFormatado;
    }

    async atualizarProgressoMissoes(userId) {
        console.log(`[MissaoService] Iniciando atualização para o usuário: ${userId}`);

        const missoesAtivas = await MissaoRepository.obterMissoesAtivasUsuario(userId);

        if (missoesAtivas.length === 0) {
            return;
        }

        let capibasAcumuladas = 0;
        const missoesConcluidasNestaSessao = [];

        for (const missao of missoesAtivas) {
            const statusExistente = missao.statusUsuario[0];
            
            const progressoAtual = await this._calcularProgresso(userId, missao);

            const isConcluida = progressoAtual >= missao.valorRequisito;

            if (isConcluida && (!statusExistente || !statusExistente.concluida)) {
                missoesConcluidasNestaSessao.push(missao);
                capibasAcumuladas += missao.recompensaCapibas;
                console.log(`Missão Concluída: ${missao.titulo} (+${missao.recompensaCapibas} Capibas)`);
            }

            await MissaoRepository.atualizarStatus(
                missao.id,
                userId,
                progressoAtual,
                isConcluida
            );
        }

        if (capibasAcumuladas > 0) {
            await MissaoRepository.adicionarCapibas(userId, capibasAcumuladas);
        }

        return {
            concluidas: missoesConcluidasNestaSessao.map(m => m.titulo),
            capibasGanha: capibasAcumuladas
        };
    }


    async _calcularProgresso(userId, missao) {
        switch (missao.tipoRequisito) {
            case TipoMissao.COUNT_CHECKINS:
                return MissaoRepository.contarTotalCheckins(userId);

            case TipoMissao.UNIQUE_LOCATIONS:
                return MissaoRepository.contaLocaisUnicos(userId);

            case TipoMissao.SPECIFIC_TAG:
                return MissaoRepository.contarCheckinsPorTag(userId, missao.tagRequisito);

            default:
                console.error(`TipoMissao não reconhecido: ${missao.tipoRequisito}`);
                return 0;
        }
    }
}

module.exports = new MissaoService();
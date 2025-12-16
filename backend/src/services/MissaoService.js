const Missao = require('../models/Missao');
const { TipoMissao } = require('@prisma/client');

class MissaoService {
    constructor() {
        this.missaoRepository = new Missao();
    }

    async buscarStatusUsuario(userId) {
        const missoes = await this.missaoRepository.listar();
        const listaStatus = await this.missaoRepository.statusUsuario(userId);

        return missoes.map((missao) => {
            const status = listaStatus.find((s) => s.missaoId === missao.id);

            return {
                id: missao.id,
                titulo: missao.titulo,
                progressoAtual: status ? status.progressoAtual : 0,
                concluida: status ? status.concluida : false,
                valorRequisito: missao.valorRequisito,
                recompensaCapibas: missao.recompensaCapibas,
            };
        });
    }

    async atualizarProgressoMissoes(userId) {
        const missoesAtivas = await this.missaoRepository.listar();

        let capibasAcumuladas = 0;
        const missoesConcluidasNestaSessao = [];

        for (const missao of missoesAtivas) {
            const statusExistente = (await this.missaoRepository.statusUsuario(userId)).find(
                (s) => s.missaoId === missao.id
            );

            const progressoAtual = await this._calcularProgresso(userId, missao);
            const isConcluida = progressoAtual >= missao.valorRequisito;

            if (isConcluida && (!statusExistente || !statusExistente.concluida)) {
                missoesConcluidasNestaSessao.push(missao);
                capibasAcumuladas += missao.recompensaCapibas;
            }

            await this.missaoRepository.atualizarStatus(
                missao.id,
                userId,
                progressoAtual,
                isConcluida
            );
        }

        if (capibasAcumuladas > 0) {
            await this.missaoRepository.adicionarCapibas(userId, capibasAcumuladas);
        }

        return {
            concluidas: missoesConcluidasNestaSessao.map((m) => m.titulo),
            capibasGanha: capibasAcumuladas,
        };
    }

    async _calcularProgresso(userId, missao) {
        switch (missao.tipoRequisito) {
            case TipoMissao.COUNT_CHECKINS:
                return await this.missaoRepository.contarTotalCheckins(userId);

            case TipoMissao.COUNT_UNIQUE_LOCATIONS:
                return await this.missaoRepository.contarLocaisUnicos(userId);

            default:
                console.warn(
                    `Tipo de requisito desconhecido ou não implementado: ${missao.tipoRequisito}`
                );
                return 0;
        }
    }
}

module.exports = new MissaoService();

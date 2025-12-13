const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Missao {
    async obterPorId(missaoId) {
        return prisma.missao.findUnique({
            where: { id: missaoId },
        });
    }

    async listar() {
        return prisma.missao.findMany();
    }

    async statusUsuario(usuarioId) {
        return prisma.statusUsuario.findMany({
            where: { usuarioId },
        });
    }

    async obterMissoesAtivasUsuario(usuarioId) {
        return prisma.missao.findMany({
            where: {
                statusUsuario: {
                    none: {
                        usuarioId: usuarioId,
                        concluida: true,
                    },
                },
            },
            include: {
                statusUsuario: {
                    where: { usuarioId: usuarioId }
                }
            }
        });
    }


    async atualizarStatus(missaoId, usuarioId, progressoAtual, isConcluida) {
        return prisma.statusUsuario.upsert({
            where: {
                missaoId_usuarioId: {
                    missaoId: missaoId,
                    usuarioId: usuarioId,
                },
            },
            update: {
                progressoAtual: progressoAtual,
                concluida: isConcluida,
                dataConclusao: isConcluida ? new Date() : null,
            },
            create: {
                missaoId: missaoId,
                usuarioId: usuarioId,
                progressoAtual: progressoAtual,
                concluida: isConcluida,
                dataConclusao: isConcluida ? new Date() : null,
            }
        });
    }

    async contarTotalCheckins(usuarioId) {
        return prisma.checkIn.count({
            where: { usuarioId },
        });
    }

    async contaLocaisUnicos(usuarioId) {
        const checkinsUnicos = await prisma.checkIn.groupBy({
            by: ['eventoId'],
            where: { usuarioId },
        });
        return checkinsUnicos.length;
    }

    async contarCheckinsPorTag(usuarioId, tag) {
        return prisma.checkIn.count({
            where: {
                usuarioId,
                evento: {
                    categoria: tag,
                },
            },
        });
    }

    async adicionarCapibas(usuarioId, capibasAcumuladas) {
        return prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                saldoCapiba: {
                    increment: capibasAcumuladas,
                },
            },
        });
    }
}

module.exports = Missao;

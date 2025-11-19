const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CaravanaService {
    async criarCaravana(nome) {
        return await prisma.caravana.create({
            data: {
                nome,
                data: new Date()
            }
        });
    }

    async listarCaravanas() {
        return await prisma.caravana.findMany({ include: { membros: true } });
    }

    async obterPorId(id) {
        return await prisma.caravana.findUnique({
            where: { id },
            include: { membros: true, eventoDestino: true }
        });
    }

    async adicionarMembro(caravanaId, usuarioId) {
        return await prisma.caravana.update({
            where: { id: caravanaId },
            data: {
                membros: { connect: { id: usuarioId } }
            },
            include: { membros: true }
        });
    }

    async adicionarDestino(caravanaId, eventoId) {
        return await prisma.caravana.update({
            where: { id: caravanaId },
            data: { eventoId }
        });
    }

    async removerCaravana(id) {
        return await prisma.caravana.delete({ where: { id } });
    }
}

module.exports = new CaravanaService();

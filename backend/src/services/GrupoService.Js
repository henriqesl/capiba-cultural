const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GrupoService {
    constructor() {
        this.prisma = prisma;
    }

    async criarGrupo(nome, dataInicio, dataFim) {
        if (!nome) throw new Error("Nome do grupo é obrigatório");
        if (!dataInicio || !dataFim) throw new Error("Datas de início e fim são obrigatórias");

        return await this.prisma.grupoCompeticao.create({
            data: {
                nome,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim)
            }
        });
    }

    async listarGrupos() {
        return await this.prisma.grupoCompeticao.findMany({
            include: { membros: true }
        });
    }

    async obterPorId(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido.");

        const grupo = await this.prisma.grupoCompeticao.findUnique({
            where: { id: numericId },
            include: { membros: true }
        });

        if (!grupo) throw new Error("Grupo não encontrado.");
        return grupo;
    }

    async adicionarMembro(grupoId, usuarioId) {
        const numericId = parseInt(grupoId, 10);
        const numericUserId = parseInt(usuarioId, 10);

        const grupo = await this.prisma.grupoCompeticao.findUnique({
            where: { id: numericId },
            select: { encerrado: true }
        });

        if (!grupo) throw new Error("Grupo não encontrado");
        if (grupo.encerrado) throw new Error("Grupo encerrado.");

        const usuario = await this.prisma.usuario.findUnique({
            where: { id: numericUserId }
        });

        if (!usuario) throw new Error("Usuário não encontrado");

        await this.prisma.grupoCompeticao.update({
            where: { id: numericId },
            data: {
                membros: {
                    connect: { id: numericUserId }
                }
            }
        });

        return { message: "Membro adicionado com sucesso!" };
    }
}

module.exports = GrupoService;

const { PrismaClient } = require('@prisma/client');

class GrupoService {
    constructor() {
        this.prisma = new PrismaClient();               
    }

    async criarGrupo(nome, dataInicio, dataFim) {
        if (!nome) throw new Error("Nome do grupo é obrigatório");
        if (!dataInicio || !dataFim) throw new Error("Datas de início e fim são obrigatórias");

        try {
            const novoGrupo = await this.prisma.grupoCompeticao.create({
                data: {
                    nome: nome,
                    dataInicio: dataInicio, 
                    dataFim: dataFim,
                    encerrado: encerrado,
                    pontuacaoTotal: pontuacaoTotal
                }

            })      
        return novoGrupo

    } catch (error) {
        throw error
    }
}

    async listarGrupos() {
        return await this.prisma.grupoCompeticao.findMany()
    }

    async obterPorId(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido, deve ser um número.");

        const grupo = await this.prisma.grupoCompeticao.findUnique({
            where: { id: numericId}
        })
        if (!grupo) throw new Error("Grupo não encontrado.");
        return grupo;
    }

    async adicionarMembro(grupoId, usuario) {
        const numericId = parseInt(id, 10);
        const numericUserId = parseInt(usuarioId, 10);

        if (isNaN(numericId)) throw new Error("ID da caravana inválido.");
        if (isNaN(numericUserId)) throw new Error("ID do usuário inválido.");

        const grupo = await this.prisma.grupoCompeticao.findUnique({
            where: { id: numericId },
            select: { encerrado: true }
        })

        if (!grupo) {
            throw new Error("Grupo não encontrado");
        }

        if (grupo.encerrado) throw new Error("Não é possível adicionar membros a um grupo encerrado.");


        const usuario = await prisma.usuario.findUnique({
            where: { id: numericUserId }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        
    
        await this.prisma.grupoCompeticao.update({
            where: { id: numericId },
            data: { 
                membros: {
                    connect: { id: numericUserId }
                }
            }
        })

        return grupoCompeticao;
    
    }

    atualizarPontuacoes() {
        const usuarios = await prisma.usuario.findMany({
            where: { grupoId: grupoId },
            });
    }

    encerrarGrupo(grupoId) {
        const grupo = this.obterPorId(grupoId);
        grupo.encerrarGrupo();
        return {
            id: grupo.id,
            nome: grupo.nome,
            vencedor: grupo.vencedor || null,
            pontuacaoTotal: grupo.pontuacaoTotal,
            encerrado: grupo.encerrado
        };
    }

    verificarGruposExpirados() {
        const agora = new Date();
        this.grupos.forEach(grupo => {
            if (!grupo.encerrado && grupo.dataFim < agora) {
                grupo.encerrarGrupo();
                console.log(`Grupo "${grupo.nome}" foi encerrado automaticamente.`);
            }
        });
    }

    removerGrupo(id) {
        const index = this.grupos.findIndex(g => g.id === id);
        if (index === -1) return false;
        this.grupos.splice(index, 1);
        return true;
    }
}

module.exports = GrupoService;
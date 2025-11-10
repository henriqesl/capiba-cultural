const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Usuario = require('./usuario');

class GrupoCompeticao {
    async novoGrupoCompeticao(nome, dataInicio, dataFim, encerrado = false, pontuacaoTotal) {
        return await prisma.GrupoCompeticao.create({
            data: {
                nome,
                dataInicio: Date ? data : new Date(dataInicio), 
                dataFim: Date ? data : new Date(dataFim),
                encerrado,
                membros,
                pontuacaoTotal: 0,
                vencedor: null
            }

        })

    }

    async listar() {
        return await prisma.GrupoCompeticao.findMany();
    }
    
    async obterPorId(id) {
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id }
        });
    }

    async adicionarMembro(grupoId, usuarioId) {
        return await prisma.grupoCompeticao.update({
            where: { id: grupoId },
            data: {
                membros: { connect: { id: usuarioId }  }
            },
            include: { membros: true } 
        });
    }

    async getMembros(grupoId) {
        const grupo = await prisma.grupoCompeticao.findUnique({
            where: { id: grupoId },
            include: { membros: true }
        });
        return grupo?.membros || [];
    }

    async getNome(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { nome: true }
        }) 
    }

    async setNome(id, value) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { nome: value }, 
            select: { nome: true }
         })
    }


    async getMembros(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { membros: true }
        }) 
    }

    async setMembros(id, list) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { membros: list }, 
            select: { membros: true }
         })
    }

    
    async getDataInicio(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { dataInicio: true }
        }) 
    }

    async setDataInicio(id, value) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { dataInicio: value }, 
            select: { dataInicio: true }
         })
    }

    async getDataFim(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { dataFim: true }
        }) 
    }

    async setDataFim(id, value) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { dataFim: value }, 
            select: { dataFim: true }
         })
    }


    async getEncerrado(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { encerrado: true }
        }) 
    }

    async setEncerrado(id, value) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { encerrado: value }, 
            select: { encerrado: true }
         })
    }

    
    async getPontuacaoTotal(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { pontuacaoTotal: true }
        }) 
    }

    async setPontuacaoTotal(id, value) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { pontuacaoTotal: value }, 
            select: { pontuacaoTotal: true }
         })
    }

    
    async getVencedor(id) { 
        return await prisma.GrupoCompeticao.findUnique({
            where: { id: id },
            select: { vencedor: true }
        }) 
    }

    async setVencedor(id, value) { 
         return await prisma.GrupoCompeticao.update({
            where: { id: id },
            data: { vencedor: value }, 
            select: { vencedor: true }
         })
    }

}
module.exports = GrupoCompeticao;
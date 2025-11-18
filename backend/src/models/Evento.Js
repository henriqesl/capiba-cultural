const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Evento {

    async novoEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false, participantesIds = [], caravanasIds =[]) {
        return await prisma.evento.create({
            data: {
                nome,
                local,
                data: data instanceof Date ? data : new Date(data),
                descricao,
                pequenoPorte,
                ativo: true,
                aoVivo: false,
                reportadoPorUsuario, 
                confirmacoes: 0,

                participantes: participantesIds.length
                    ? { connect: participantesIds.map(id => ({ id })) }
                    : undefined,

                caravanas: caravanasIds.length
                    ? { connect: caravanasIds.map(id => ({ id })) }
                    : undefined
            },

            include: {
                participantes: true, 
                caravanas: true,
                reportes: true 
            }
        });
    }

    async listar() {
        return await prisma.evento.findMany({
            include: {
                participantes: true,
                caravanas: true,
                reportes: true
            }
        });
    }

    async obterPorId(id) {
        return await prisma.evento.findUnique({
            where: { id: id },
            include: {
                participantes: true,
                caravanas: true,
                reportes: true
            }
        });
    }


    async obterPorNome(nome) {
        return await prisma.evento.findUnique({
            where: { nome: nome },
            include: {
                participantes: true,
                caravanas: true,
                reportes: true
            }
        });
    }


    async removerEvento(id) {
        return await prisma.evento.delete({
            where: { id: id }  
        });
    }

    async setNome(id, nome) { 
        return await prisma.evento.update({
            where: { id: id },
            data: { nome: nome },
            select: { nome: true }
        });
    }
        

    async getNome(id) { 
        return await prisma.evento.findUnique({
            where: { id: id },
            select: { nome: true }
        })
    }

    async setLocal(id, local) { 
        return await prisma.evento.update({
            where: { id: id },
            data: { local: local },
            select: { local: true }
        });
    }   

    async getLocal(id) { 
        return await prisma.evento.findUnique({
            where: { id: id },
            select: { local: true }
        });
    }   

    async setData(id, data) { 
        return await prisma.evento.update({
            where: { id: id },
            data: {data: data },
            select: { data: true }
        });
    }   

    async getData(id) { 
        return await prisma.evento.findUnique({
            where: { id: id },
            select: { data: true }
        });
    }   


    async setDescricao(id, descricao) { 
        return await prisma.evento.update({
            where: { id: id },
            data: { descricao: descricao },
            select: { descricao: true }
        });
    }   

    async getDescricao(id) { 
        return await prisma.evento.findUnique({
            where: { id: id },
            select: { descricao: true }
        });
    }   


    async setReportadoPorUsuario(id, valor) { 
        return await prisma.evento.update({
            where: { id: id },
            data: { reportadoPorUsuario: valor },
            select: { reportadoPorUsuario: true }
        });
    }   

    async getReportadoPorUsuario(id) { 
        return await prisma.evento.findUnique({
            where: { id: id },
            select: { reportadoPorUsuario: true }
        });
    }   
}

module.exports = Evento;

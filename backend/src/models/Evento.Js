const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Evento {

    async novoEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false) {
        return await prisma.evento.create({
            data: {
                nome,
                local,
                data: Date ? data : new Date(data),
                descricao,
                pequenoPorte,
                ativo: true,
                aoVivo: false,
                participantes,
                caravanas, 
                reportadoPorUsuario, 
                confirmacoes: 0
            }
        });
    }

    async listar() {
        return await prisma.evento.findMany();
    }

    async obterPorId(id) {
        return await prisma.evento.findUnique({
            where: { id: id}
        });
    }


    async obterPorNome(nome) {
        return await prisma.evento.findUnique({
            where: { nome: nome }
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

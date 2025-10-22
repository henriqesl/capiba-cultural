const { PrismaClient } = require('@prisma/client');

class EventoService {
    constructor() {
        this.prisma = new PrismaClient();               
    }

    async criarEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false) {
        if (!nome || !local || !data || !descricao)
            throw new Error("Todos os campos são obrigatórios");

        if (isNaN(Date.parse(data)))
            throw new Error("Data inválida");

        if (!reportadoPorUsuario && this.eventos.some(e => e.nome === nome))
            throw new Error("Evento já cadastrado");


        try {

            const evento = await this.prisma.evento.create({
                data: {
                    nome: nome,
                    local: local,
                    data: data,
                    descricao: descricao,
                    pequenoPorte: pequenoPorte,
                    reportadoPorUsuario: reportadoPorUsuario
                }
            })

            return evento;

        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error("Erro de banco de dados: Violação de chave única.");
            }
            throw error
        }

    }

    async listarEventos() {
        return await this.prisma.evento.findMany()
    }

    async obterPorId(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido, deve ser um número.");

        const evento = await this.prisma.evento.findUnique({
            where: {
                id: numericId
            }
        });

        if (!evento) {
            throw new Error("Evento não encontrado");
        }
        
        return evento;
    }
    async removerEvento(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido, deve ser um número.");
        
        try {
            const eventoRemovido = await this.prisma.evento.delete({
                where: {
                    id: numericId
                }
            });
            return eventoRemovido; 
        } catch (error) {
            if (error.code === 'P2025') {
                 throw new Error("Evento não encontrado");
            }
            throw error;
        }
    }
}

module.exports = EventoService;
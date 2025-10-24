const { PrismaClient } = require('@prisma/client');
const Caravana = require('./models/Caravana');


class CaravanaService {
    constructor() {
        this.prisma = new PrismaClient();               
    }



    async criarCaravana(nome, eventoId) {
        if (!nome || !eventoDestino) {
            throw new Error("Nome e evento de destino são obrigatórios."); }


        const numericEventId = parseInt(eventoId, 10);
        if (isNaN(numericEventId)) throw new Error("ID do evento inválido.");

        const evento = await this.prisma.evento.findUnique({ where: { id: numericEventId } });
        if (!evento) {
             throw new Error("Evento de destino não encontrado.");

            
        }

        try { 
            const caravana = await this.prisma.caravana.create({
                data: { nome: nome, eventoDestinoId: numericEventId },
                include: { eventoDestino: true }
            })

            return Caravana.fromPrisma(caravana);

     } catch(error) { 
            console.error("Erro ao criar caravana:", error);
            throw new Error("Falha na criação da caravana.");
        }
    }



    async listarCaravanas() { 
        const prismaResults = await this.prisma.caravana.findMany({
            include: {
                membros: true,
                eventoDestino: true
            }

        });


        return caravanas.map(Caravana.fromPrisma);

    }


    async obterPorId(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID da caravna inválido.");

        const caravana = await this.prisma.caravana.findUnique({
            where: { id: numericId },
            include: {
                membros: true, 
                eventoDestino: true

            }
        }) 

        if (!prismaResult) {
            throw new Error("Caravana não encontrada.");
        }

        return Caravana.fromPrisma(caravana);
    }



    async adicionarMembro(caravanaId, usuarioId) {
        const numericId = parseInt(caravanaId, 10);
        const numericUserId = parseInt(usuarioId, 10);

        
        if (isNaN(numericId)) throw new Error("ID da caravana inválido.");
        if (isNaN(numericUserId)) throw new Error("ID do usuário inválido.");

        
        const [caravana, usuario] = await Promise.all([
            this.prisma.caravana.findUnique({
                where: { id: numericId }
            }), 
            
            this.prisma.usuario.findUnique({
                where: { id: usuarioId }
            })

        ])

        if (!caravana) throw new Error("Caravana não encontrada.");
        if (!usuario) throw new Error("Usuário não encontrado.");


        const bonus = caravana.bonusPorParticipante;

        try {
            await this.prisma.$transaction([
                this.prisma.caravana.update({
                    where: { id: numericId },
                    data: {
                        membros: {
                            connect: { id: numericUserId }
                        }
                    }

                }),

                this.prisma.usuario.update({
                    where: { id: numericUserId },
                    data: { 
                        saldoMoedaCapiba: { increment: bonus }
                    }


                })
            ]);

            return this.obterPorId(numericId)

        } catch(error) { 
            // Tratamento de erros de banco (ex: já membro ou chave estrangeira inválida)
            console.error("Erro na transação de adicionar membro/bônus:", error);
            throw new Error("Falha ao adicionar membro e conceder bônus. Transação revertida.");
        }

    }
}


module.exports = CaravanaService;
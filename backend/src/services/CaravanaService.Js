const Caravana = require('../models/Caravana');

class CaravanaService {
    constructor() {
        this.prisma = new PrismaClient();               
    }



    async criarCaravana(nome, eventoDestino) {
        if (!nome || !eventoDestino) {
            throw new Error("Nome e evento de destino são obrigatórios."); }

        try { 
            const caravana = await this.prisma.caravana.create({
                data: { nome: nome, eventoDestino, eventoDestino }
            })

            return caravana 
        } catch(error) { throw error }
    }



    async listarCaravanas() { 
        return this.prisma.caravana.findMany(); }


    async obterPorId(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido, deve ser um número.");


        const caravana = await this.prisma.caravana.findUnique({
            where: { id: numericId }   
        })

        if (!caravana) {
            throw new Error("Caravana não encontrada.");
        }
        return caravana;
    }



    async adicionarMembro(caravanaId, usuarioId) {
        const numericId = parseInt(caravanaId, 10);
        const numericUserId = parseInt(usuarioId, 10);

        
        if (isNaN(numericId)) throw new Error("ID da caravana inválido.");
        if (isNaN(numericUserId)) throw new Error("ID do usuário inválido.");


        const caravana = await this.prisma.caravana.findUnique({ 
            where: { id: numericId }
        })

        if (!caravana) {
            throw new Error("Caravana não encontrada");
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: numericUserId }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        return caravana;
    }

    
}


module.exports = CaravanaService;
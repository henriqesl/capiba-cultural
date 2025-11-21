const Caravana = require('../models/Caravana');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CaravanaService {
    constructor() {
      this.caravanaRepository = new Caravana();
    }

    async criarCaravana(nome, eventoId = null, bonusPorParticipante = 10) {
        if (!nome) {
            throw new Error("Nome da caravana é obrigatório."); }
        
        return await this.caravanaRepository.criarCaravana(nome, eventoId, bonusPorParticipante = 10);
    }

    async listarCaravanas() {
        return await this.caravanaRepository.listar();
    }

    async obterPorId(id) {
        const caravana = await this.caravanaRepository.obterPorId(id);
        if (!caravana) throw new Error("Caravana não encontrada");

        return caravana;
    }

    async adicionarMembro(caravanaId, usuarioId) {
        const caravana = await this.caravanaRepository.obterPorId(caravanaId);
        if (!caravana) throw new Error("Grupo não encontrado.");

        const membros = caravana.membros.map(m => m.id);
        if (membros.includes(usuarioId)) {
            throw new Error("Usuário já faz parte da caravana.");
        }

        await this.caravanaRepository.adicionarMembro(caravanaId, usuarioId);
        return await this.caravanaRepository.obterPorId(caravanaId);
      
    }


    async adicionarDestino(caravanaId, eventoId) {
        return await this.caravanaRepository.adicionarDestino(caravanaId, eventoId)
    }

    async removerCaravana(id) {
        return await this.caravanaRepository.remover(id);
    }
}

module.exports = new CaravanaService;

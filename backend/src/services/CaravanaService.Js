const Caravana = require('../models/Caravana');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CaravanaService {
    constructor() {
      this.caravanaRepository = new Caravana();
    }

    async criarCaravana(nome, eventoId, bonusPorParticipante = 10) {
        if (!nome || !!eventoId) {
            throw new Error("Nome e evento de destino são obrigatórios."); }
        
        const evento = this.caravanaRepository.criarCaravana(nome, eventoId, bonusPorParticipante = 10);
        if (!evento) {
            throw new Error("Evento de destino não encontrado.");
        }
    }

    async listarCaravanas() {
        return await this.caravanaRepository.listar();
    }

    async obterPorId(id) {
        const caravana = this.caravanaRepository.obterPorId(id);
        if (!caravana) throw new Error("Caravana não encontrada");

        return caravana;
    }

    async adicionarMembro(caravanaId, usuarioId) {
        const caravana = await this.caravanaRepository.obterPorId(caravanaId);
        if (!caravana) throw new Error("Grupo não encontrado.");

        const membros = await this.caravanaRepository.getMembros(caravanaId);
        if (membros.some(m => m.id === usuario.id)) {
            throw new Error("Usuário já faz parte do grupo.");
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

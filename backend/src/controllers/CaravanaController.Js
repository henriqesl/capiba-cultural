const caravanaService = require('../services/CaravanaService.Js');

class CaravanaController {
    async criarCaravana(nome) {
        try {
            const caravana = await caravanaService.criarCaravana(nome);
            console.log(`Caravana criada com sucesso: ${caravana.nome}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao criar caravana:", error.message);
            throw error;
        }
    }

    async listarCaravanas() {
        try {
            const caravanas = await caravanaService.listarCaravanas();
            console.log("Caravanas cadastradas:");
            caravanas.forEach(c => {
                console.log(`Nome: ${c.nome}`);
            });
            return caravanas;
        } catch (error) {
            console.error("Erro ao listar caravanas:", error.message);
            throw error;
        }
    }

    async obterPorId(id) {
        try {
            const caravana = await caravanaService.obterPorId(id);
            console.log(`Procurando caravana por ID: ${id}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao encontrar caravana por ID:", error.message);
            throw error;
        }
    }

    async adicionarMembro(id, usuario) {
        try {
            const caravana = await caravanaService.adicionarMembro(id, usuario.getId());
            console.log(`Adicionando usuário ${usuario.nome} na caravana ${caravana.nome}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao adicionar usuário à caravana:", error.message);
            throw error;
        }
    }

    async adicionarDestino(id, eventoId) {
        try {
            const caravana = await caravanaService.adicionarDestino(id, eventoId);
            console.log(`Evento ${eventoId} adicionado à caravana ${caravana.nome}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao adicionar destino à caravana:", error.message);
            throw error;
        }
    }

    async removerCaravana(id) {
        try {
            const caravanaRemovida = await caravanaService.removerCaravana(id);
            console.log(`Caravana ${caravanaRemovida.nome} removida com sucesso!`);
            return caravanaRemovida;
        } catch (error) {
            console.error("Erro ao remover caravana:", error.message);
            throw error;
        }
    }
}

module.exports = CaravanaController;

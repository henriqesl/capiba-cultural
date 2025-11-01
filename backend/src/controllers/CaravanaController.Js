const caravanaService = require('../services/CaravanaService');

class CaravanaController {
    async criarCaravana(nome) {
        try {
            const caravana = await caravanaService.criarCaravana(nome);
            console.log(`Caravana criada com sucesso: ${caravana.getNome()}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao criar caravana:", error.message);
        }
    }

    async listarCaravanas() {
        try {
            const caravanas = await caravanaService.listarCaravanas();
            console.log("Caravanas cadastradas:");
            caravanas.forEach(c => {
                const evento = c.getEventoDestino();
                console.log(`Nome: ${c.getNome()}, Evento de Destino: ${evento ? evento.getNome() : 'Não definido'}`);
            });
            return caravanas;
        } catch (error) {
            console.error("Erro ao listar caravanas:", error.message);
        }
    }

    async obterPorId(id) {
        try {
            const caravana = await caravanaService.obterPorId(id);
            console.log(`Procurando caravana por ID: ${id}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao encontrar caravana por ID:", error.message);
        }
    }

    async adicionarMembro(id, usuario) {
        try {
            const caravana = await caravanaService.adicionarMembro(id, usuario.getId());
            console.log(`Adicionando usuário ${usuario.getNome()} na caravana ${caravana.getNome()}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao adicionar usuário à caravana:", error.message);
        }
    }

    async adicionarDestino(id, evento) {
        try {
            const caravana = await caravanaService.adicionarDestino(id, evento);
            console.log(`Evento ${evento.getNome()} adicionado à caravana ${caravana.getNome()}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao adicionar destino à caravana:", error.message);
        }
    }

    async removerCaravana(id) {
        try {
            const caravanaRemovida = await caravanaService.removerCaravana(id);
            console.log(`Caravana ${caravanaRemovida.getNome()} removida com sucesso!`);
            return caravanaRemovida;
        } catch (error) {
            console.error("Erro ao remover caravana:", error.message);
        }
    }
}

module.exports = CaravanaController;
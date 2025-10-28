const CaravanaService = require('../services/CaravanaService');

class CaravanaController {
    constructor() {
        this.caravanaService = new CaravanaService();
    }

    criarCaravana(nome, eventoDestino) {
        try {
            const caravana = this.caravanaService.criarCaravana(nome, eventoDestino);
            console.log(`Caravana criada com sucesso: ${caravana.nome}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao criar caravana:", error.message);
        }
    }

    listarCaravanas() {
        try {
            const caravanas = this.caravanaService.listarCaravanas();
            console.log(`Caravanas Cadastradas:`);
            caravanas.forEach(c => {
                console.log(`Nome: ${c.nome}, Evento de Destino: ${c.eventoDestino?.nome || 'Não definido'}`);
            });
            return caravanas;
        } catch (error) {
            console.error("Erro ao listar caravanas:", error.message);
        }
    }

    obterPorId(id) {
        try {
            const caravana = this.caravanaService.obterPorId(id);
            console.log(`Procurando caravana por ID: ${id}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao encontrar caravana por ID:", error.message);
        }
    }

    adicionarMembro(id, usuario) {
        try {
            const caravana = this.caravanaService.adicionarMembro(id, usuario);
            console.log(`Adicionando usuário ${usuario.nome} na caravana ${caravana.nome}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao adicionar usuário à caravana:", error.message);
        }
    }

    removerCaravana(id) {
        try {
            const caravanaRemovida = this.caravanaService.removerCaravana(id);
            console.log(`Caravana ${caravanaRemovida.nome} removida com sucesso!`);
            return caravanaRemovida;
        } catch (error) {
            console.error("Erro ao remover caravana:", error.message);
        }
    }
}

module.exports = CaravanaController;
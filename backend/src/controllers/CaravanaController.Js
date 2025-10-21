const CaravanaService = require('../services/CaravanaService');

class CaravanaController {
    constructor(){
        this.CaravanaService = new CaravanaService();
    }

    criarCaravana(nome, eventoDestino){
        try {
            const caravana = this.CaravanaService.criarCaravana(nome, eventoDestino);
            console.log(`Caravana criada com sucesso: ${caravana.nome}`);
            return caravana;
        } catch (error){
            console.error("Erro ao criar caravana: ", error.message);
        }
    }

    listarCaravanas(){
        try{
            const caravanas = this.CaravanaService.listarCaravanas();
            console.log(`Caravanas Cadastradas: `);
            caravanas.forEach(c => {
                console.log(`Nome: ${c.nome}, Evento de Destino: ${c.eventoDestino}`);

            });
            return caravanas;
        } catch (error) {
            console.error("Erro ao listar caravana: ", error.message);
        }
    }

    obterPorId(id) {
        try {
            const caravana = this.CaravanaService.obterPorId(id);
            console.log(`Procurando caravana por ID: ${id}`);
            return caravana;
        } catch (error) {
            console.error("Erro ao encontrar caravana por ID: ", error.message);
        }
    }

    adicionarMembro(id, usuario){
        try {
            const caravana = this.CaravanaService.adicionarMembro(id, usuario);
            console.log(`Adicionando usuário ${usuario.nome} na caravana ${caravana.nome}`);
            return caravana;
        } catch (error){
            console.error("Erro ao adicionar usuário a caravana", error.message);
        }
    }
}

module.exports = CaravanaController;
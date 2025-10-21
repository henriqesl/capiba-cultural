const EventoService = require('../services/EventoService');

class EventoController {
    constructor() {
        this.eventoService = new EventoService();
    }

    criarEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false) {
        try {
            const evento = this.eventoService.criarEvento(nome, local, data, descricao, pequenoPorte = false, reportadoPorUsuario = false);
            console.log(`Evento criado com sucesso: ${evento.nome}`);
            return evento;
        } catch (error) {
            console.error("Erro ao criar evento:", error.message);
        }
    }

    listarEventos() {
        try {
            const eventos = this.eventoService.listarEventos();
            console.log("Eventos cadastrados:");
            eventos.forEach(e => {
                console.log(`ID: ${e.id}, Nome: ${e.nome}, Local: ${e.local}, Data: ${e.data.toISOString().slice(0,10)}, Oficial: ${e.reportadoPorUsuario ? "❌" : "✅"}`);
            });
            return eventos;
        } catch (error) {
            console.error("Erro ao listar eventos:", error.message);
        }
    }

    obterPorId(id) {
        try {
            const evento = this.eventoService.obterPorId(id);
            console.log(`Procurando evento por ID: ${id}`);
            return evento;
        } catch (error) {
            console.error("Erro ao procurar evento por ID:", error.message);
        }
    }

    removerEvento(id) {
        try {
            const evento = this.eventoService.removerEvento(id);
            console.log(`Removendo evento ${evento.nome} pelo ID: ${evento.id}`);
            return evento;
        } catch (error) {
            console.error("Erro ao remover evento por ID:", error.message);
        }
    }
}

module.exports = EventoController;
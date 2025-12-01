const eventoService = require("../services/EventoService");

class EventoController {
  async criarEvento(
    nome,
    local,
    data,
    descricao,
    pequenoPorte = false,
    reportadoPorUsuario = false,
  ) {
    try {
      const evento = await eventoService.criarEvento(
        nome,
        local,
        data,
        descricao,
        pequenoPorte,
        reportadoPorUsuario,
      );
      console.log(`Evento criado com sucesso: ${evento.nome}`);
      return evento;
    } catch (error) {
      console.error("Erro ao criar evento:", error.message);
      throw error;
    }
  }

  async listarEventos() {
    try {
      const eventos = await eventoService.listarEventos();
      console.log("Eventos cadastrados:");
      eventos.forEach((e) => {
        console.log(
          `ID: ${e.id}, Nome: ${e.nome}, Local: ${e.local}, Data: ${e.data.toISOString().slice(0, 10)}, Oficial: ${e.reportadoPorUsuario ? "❌" : "✅"}`,
        );
      });
      return eventos;
    } catch (error) {
      console.error("Erro ao listar eventos:", error.message);
      throw error;
    }
  }

  async obterPorId(id) {
    try {
      const evento = await eventoService.obterPorId(id);
      console.log(`Evento encontrado: ${evento.nome}`);
      return evento;
    } catch (error) {
      console.error("Erro ao procurar evento por ID:", error.message);
      throw error;
    }
  }

  async removerEvento(id) {
    try {
      const evento = await eventoService.removerEvento(id);
      console.log(`Removendo evento ${evento.nome} pelo ID: ${evento.id}`);
      return evento;
    } catch (error) {
      console.error("Erro ao remover evento por ID:", error.message);
      throw error;
    }
  }
}

module.exports = EventoController;

const eventoService = require("../services/EventoService");

class EventoController {
  async criarEvento(req, res) {
    const {
      nome,
      local,
      data,
      descricao,
      pequenoPorte = false,
      reportadoPorUsuario = false,
    } = req.body;

    try {
      const evento = await eventoService.criarEvento(
        nome,
        local,
        data,
        descricao,
        pequenoPorte,
        reportadoPorUsuario
      );
      res.status(201).json({
        mensagem: `Evento criado com sucesso: ${evento.nome}`,
        evento,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro ao criar evento: ${error.message}` });
    }
  }

  async listarEventos(req, res) {
    try {
      const eventos = await eventoService.listarEventos();
      res.status(200).json(eventos);
    } catch (error) {
      res
        .status(500)
        .json({ erro: `Erro ao listar eventos: ${error.message}` });
    }
  }

  async obterPorId(req, res) {
    const { id } = req.params;

    try {
      const evento = await eventoService.obterPorId(Number(id));
      if (!evento) {
        return res
          .status(404)
          .json({ erro: `Evento com ID ${id} não encontrado` });
      }
      res.status(200).json(evento);
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao procurar evento por ID: ${error.message}` });
    }
  }

  async removerEvento(req, res) {
    const { id } = req.params;

    try {
      const eventoRemovido = await eventoService.removerEvento(Number(id));
      res.status(200).json({
        mensagem: `Evento "${eventoRemovido.nome}" removido com sucesso.`,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao remover evento: ${error.message}` });
    }
  }
}

module.exports = EventoController;

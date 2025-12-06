const caravanaService = require("../services/CaravanaService");
const usuarioService = require("../services/UsuarioService");
const eventoService = require("../services/EventoService");

class CaravanaController {
  async criarCaravana(req, res) {
    const { nome } = req.body;

    try {
      const caravana = await caravanaService.criarCaravana(nome);
      res.status(201).json({
        mensagem: `Caravana criada com sucesso: ${caravana.nome}`,
        caravana,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao criar caravana: ${error.message}` });
    }
  }

  async listarCaravanas(req, res) {
    try {
      const caravanas = await caravanaService.listarCaravanas();
      res.status(200).json(caravanas);
    } catch (error) {
      res
        .status(500)
        .json({ erro: `Erro ao listar caravanas: ${error.message}` });
    }
  }

  async obterPorId(req, res) {
    const { id } = req.params;

    try {
      const caravana = await caravanaService.obterPorId(Number(id));
      if (!caravana) {
        return res
          .status(404)
          .json({ erro: `Caravana com ID ${id} não encontrada` });
      }
      res.status(200).json(caravana);
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao encontrar caravana por ID: ${error.message}` });
    }
  }

  async adicionarMembro(req, res) {
    const { id } = req.params;
    const { usuarioId } = req.body;

    try {
      const usuario = await usuarioService.obterPorId(Number(usuarioId));
      if (!usuario) {
        return res
          .status(404)
          .json({ erro: `Usuário com ID ${usuarioId} não encontrado` });
      }

      const caravana = await caravanaService.adicionarMembro(id, usuario);
      res.status(200).json({
        mensagem: `Usuário ${usuario.nome} adicionado à caravana ${caravana.nome}`,
        caravana,
      });
    } catch (error) {
      res.status(400).json({
        erro: `Erro ao adicionar usuário à caravana: ${error.message}`,
      });
    }
  }

  async adicionarDestino(req, res) {
    const { id } = req.params;
    const { eventoId } = req.body;

    try {
      const evento = await eventoService.obterPorId(Number(eventoId));
      if (!evento) {
        return res
          .status(404)
          .json({ erro: `Evento com ID ${eventoId} não encontrado` });
      }

      const caravana = await caravanaService.adicionarDestino(id, evento);
      res.status(200).json({
        mensagem: `Evento ${evento.nome} adicionado como destino da caravana ${caravana.nome}`,
        caravana,
      });
    } catch (error) {
      res.status(400).json({
        erro: `Erro ao adicionar destino à caravana: ${error.message}`,
      });
    }
  }

  async removerCaravana(req, res) {
    const { id } = req.params;

    try {
      const caravanaRemovida = await caravanaService.removerCaravana(
        Number(id)
      );
      res.status(200).json({
        mensagem: `Caravana "${caravanaRemovida.nome}" removida com sucesso.`,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao remover caravana: ${error.message}` });
    }
  }

  async obterMultiplicador(req, res) {
    const caravanaId = Number(req.params.id);
    const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : null;
    const mes = req.query.mes ? Number(req.query.mes) : undefined;
    const ano = req.query.ano ? Number(req.query.ano) : undefined;

    if (!usuarioId) {
      return res
        .status(400)
        .json({ erro: "usuarioId query param obrigatório" });
    }

    try {
      const multiplicador = await caravanaService.calcularMultiplicador(
        usuarioId,
        caravanaId,
        mes,
        ano
      );
      res.status(200).json({ caravanaId, usuarioId, multiplicador });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao calcular multiplicador: ${error.message}` });
    }
  }
}

module.exports = CaravanaController;

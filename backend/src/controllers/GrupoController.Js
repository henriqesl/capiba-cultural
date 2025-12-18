const GrupoService = require("../services/GrupoService");
const UsuarioService = require("../services/UsuarioService");

class GrupoController {
  constructor() {
    this.grupoService = new GrupoService();
    this.usuarioService = new UsuarioService();
  }

  async criarGrupo(req, res) {
    const { nome, dataInicio, dataFim } = req.body;

    try {
      const grupo = await this.grupoService.criarGrupo(
        nome,
        dataInicio,
        dataFim,
      );
      res.status(201).json({
        mensagem: `Grupo ${grupo.nome} criado com sucesso!`,
        grupo,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro ao criar grupo: ${error.message}` });
    }
  }

  async listarGrupo(req, res) {
    try {
      const grupos = await this.grupoService.listarGrupos();

      grupos.sort((a, b) => {
        return b.pontuacaoTotal - a.pontuacaoTotal;
      });

      res.status(200).json(grupos);
    } catch (error) {
      res.status(500).json({ erro: `Erro ao listar grupos: ${error.message}` });
    }
  }

  async obterPorId(req, res) {
    const { id } = req.params;

    try {
      const grupo = await this.grupoService.obterPorId(Number(id));
      if (!grupo) {
        return res
          .status(404)
          .json({ erro: `Grupo com ID ${id} não encontrado` });
      }
      res.status(200).json(grupo);
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao encontrar grupo: ${error.message}` });
    }
  }

  async adicionarMembro(req, res) {
    const { id } = req.params;
    const { usuarioId } = req.body;

    try {
      const usuario = await this.usuarioService.obterPorId(usuarioId);
      if (!usuario) {
        return res
          .status(404)
          .json({ erro: `Usuário com ID ${usuarioId} não encontrado` });
      }

      const grupoAtualizado = await this.grupoService.adicionarMembro(
        Number(id),
        usuarioId,
      );
      res.status(200).json({
        mensagem: `Usuário ${usuario.nome} adicionado ao grupo ${grupoAtualizado.nome}`,
        grupo: grupoAtualizado,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao adicionar membro ao grupo: ${error.message}` });
    }
  }

  async atualizarPontuacoes(req, res) {
    try {
      const gruposAtualizados = await this.grupoService.atualizarPontuacoes();
      res.status(200).json({
        mensagem: "Pontuações atualizadas com sucesso!",
        grupos: gruposAtualizados,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao atualizar pontuações: ${error.message}` });
    }
  }

  async encerrarGrupo(req, res) {
    const { id } = req.params;

    try {
      const grupoEncerrado = await this.grupoService.encerrarGrupo(Number(id));
      res.status(200).json({
        mensagem: `Grupo ${grupoEncerrado.nome} encerrado com sucesso!`,
        grupo: grupoEncerrado,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao encerrar grupo: ${error.message}` });
    }
  }

  async verificarGruposExpirados(req, res) {
    try {
      const gruposExpirados =
        await this.grupoService.verificarGruposExpirados();
      res.status(200).json({
        mensagem: "Grupos expirados verificados com sucesso!",
        gruposExpirados,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao verificar grupos expirados: ${error.message}` });
    }
  }

  async removerGrupo(req, res) {
    const { id } = req.params;

    try {
      const grupoRemovido = await this.grupoService.removerGrupo(Number(id));
      res.status(200).json({
        mensagem: `Grupo ${grupoRemovido.nome} removido com sucesso!`,
        grupo: grupoRemovido,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro ao remover grupo: ${error.message}` });
    }
  }
}

module.exports = GrupoController;

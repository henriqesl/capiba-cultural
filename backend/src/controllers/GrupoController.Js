const GrupoService = require("../services/GrupoService");
const UsuarioService = require("../services/UsuarioService");

class GrupoController {
  constructor() {
    this.grupoService = new GrupoService();
    this.usuarioService = new UsuarioService();
  }

  async criarGrupo(nome, dataInicio, dataFim) {
    try {
      const grupo = await this.grupoService.criarGrupo(
        nome,
        dataInicio,
        dataFim,
      );
      console.log(`Grupo ${grupo.nome} criado com sucesso!`);
      return grupo;
    } catch (error) {
      console.error("Erro ao criar grupo: ", error.message);
      throw error;
    }
  }

  async listarGrupo() {
    try {
      const grupos = await this.grupoService.listarGrupos();
      console.log(`Grupos Cadastradao: `);
      grupos.forEach((g) => {
        console.log(
          `Nome: ${g.nome}, Data de Início: ${g.dataInicio}, Data de Fim: ${g.dataFim}`,
        );
      });
      return grupos;
    } catch (error) {
      console.error("Erro ao listar grupos: ", error.message);
      throw error;
    }
  }

  async obterPorId(id) {
    try {
      const grupo = await this.grupoService.obterPorId(id);
      console.log(`Procurando Grupo por ID: ${id}`);
      return grupo;
    } catch (error) {
      console.error("Erro ao encontrar Grupo por ID: ", error.message);
      throw error;
    }
  }

  async adicionarMembro(id, usuarioId) {
    try {
      const grupo = await this.grupoService.adicionarMembro(id, usuarioId);
      const usuario = await this.usuarioService.obterPorId(usuarioId);
      console.log(`Adicionando usuário ${usuario.nome} no grupo ${grupo.nome}`);
      return grupo;
    } catch (error) {
      console.error("Erro ao adicionar membro ao Grupo: ", error.message);
      throw error;
    }
  }

  async atualizarPontuacoes() {
    try {
      const gruposAtualizados = await this.grupoService.atualizarPontuacoes();
      console.log("Pontuações atualizadas com sucesso!");
      return gruposAtualizados;
    } catch (error) {
      console.error("Erro ao atualizar pontuação:", error.message);
      throw error;
    }
  }

  async encerrarGrupo(id) {
    try {
      const grupo = await this.grupoService.encerrarGrupo(id);
      console.log(`Grupo ${grupo.nome} encerrado com sucesso!`);
      return grupo;
    } catch (error) {
      console.error("Erro ao encerrar grupo: ", error.message);
      throw error;
    }
  }

  async verificarGruposExpirados() {
    try {
      const grupo = await this.grupoService.verificarGruposExpirados();
      console.log("Grupos expirados: ");
      return grupo;
    } catch (error) {
      console.error("Erro ao verificar grupos expirados: ", error.message);
      throw error;
    }
  }

  async removerGrupo(id) {
    try {
      const grupo = await this.grupoService.removerGrupo(id);
      console.log(`Grupo ${grupo.nome} removido com sucesso!`);
      return grupo;
    } catch (error) {
      console.error("Erro ao remover grupo: ", error.message);
      throw error;
    }
  }
}

module.exports = GrupoController;

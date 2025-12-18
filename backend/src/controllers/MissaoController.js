const MissaoService = require("../services/MissaoService");

class MissaoController {
  constructor() {
    this.missaoService = new MissaoService();
  }

  async getStatusUsuario(req, res) {
    try {
      const userId = Number(req.params.userId) || Number(req.query.usuarioId);

      if (!userId || isNaN(userId)) {
        return res.json([]);
      }

      const status = await this.missaoService.listarMissoesComProgresso(userId);
      return res.json(status);
    } catch (error) {
      console.error("❌ Erro MissaoController:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      console.log("Tentando criar missão:", req.body);
      const missao = await this.missaoService.criarMissao(req.body);
      return res.status(201).json(missao);
    } catch (error) {
      console.error("ERRO NO BACKEND:", error);

      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ erro: "Já existe uma missão com este título." });
      }

      return res.status(400).json({ erro: error.message });
    }
  }

  async atualizarStatus(req, res) {
    return res
      .status(200)
      .json({ msg: "Atualização é automática via check-in." });
  }
}

module.exports = MissaoController;

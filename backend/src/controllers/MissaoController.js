const MissaoService = require('../services/MissaoService');

class MissaoController {
  constructor() {
    this.missaoService = new MissaoService();
  }

  async getStatusUsuario(req, res) {
    try {
      // Pega ID dos Params (/1) OU da Query (?usuarioId=1)
      const userId = Number(req.params.userId) || Number(req.query.usuarioId);

      console.log(`🔍 Buscando missões para UserID: ${userId}`);

      if (!userId || isNaN(userId)) {
        console.log("⚠️ ID não fornecido. Retornando lista vazia.");
        return res.json([]); 
      }

      const status = await this.missaoService.listarMissoesComProgresso(userId);
      return res.json(status);

    } catch (error) {
      console.error('❌ Erro MissaoController:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async atualizarStatus(req, res) {
    res.status(200).json({ ok: true });
  }
}

module.exports = MissaoController;
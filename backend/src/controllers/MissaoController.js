const MissaoService = require('../services/MissaoService');

class MissaoController {
  async getStatusUsuario(req, res) {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuário inválido.' });
    }

    try {
      // Busca todas as missões com status do usuário
      const status = await MissaoService.buscarStatusUsuario(userId);
      return res.json(status);
    } catch (error) {
      console.error('Erro ao buscar status de missões:', error);
      return res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  }

  async atualizarStatus(req, res) {
    const { userId, missaoId, progressoAtual, concluida } = req.body;

    if (!userId || !missaoId) {
      return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
    }

    try {
      await MissaoService.missaoRepository.atualizarStatus(
        missaoId,
        userId,
        progressoAtual,
        concluida
      );

      return res.json({ mensagem: 'Missão atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao atualizar missão' });
    }
  }
}

module.exports = new MissaoController();

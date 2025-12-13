
const MissaoService = require('../services/MissaoService');

class MissaoController {
    async getStatusUsuario(req, res) {
        const userId = parseInt(req.params.userId); 

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'ID de usuário inválido.' });
        }

        try {
            const status = await MissaoService.buscarStatusUsuario(userId);
            
            return res.json(status);

        } catch (error) {
            console.error('Erro ao buscar status de missões:', error);
            return res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
        }
    }
}

module.exports = new MissaoController();
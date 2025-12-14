const express = require('express');
const MissaoController = require('../controllers/MissaoController');

const router = express.Router();

// Buscar todas as missões com status do usuário
router.get('/:userId', MissaoController.getStatusUsuario);

// Atualizar status de uma missão manualmente
router.post('/atualizar', MissaoController.atualizarStatus);

module.exports = router;

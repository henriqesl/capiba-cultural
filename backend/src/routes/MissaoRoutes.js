const express = require('express');
const MissaoController = require('../controllers/MissaoController');

const router = express.Router();

router.get('/:userId', MissaoController.getStatusUsuario);

router.post('/atualizar', MissaoController.atualizarStatus);

module.exports = router;

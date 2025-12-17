const express = require('express');
const MissaoController = require('../controllers/MissaoController');

const router = express.Router();
// Instanciamos o controller para garantir que funcione
const missaoController = new MissaoController();

// 1. Rota Raiz (Captura chamadas como /api/missoes?usuarioId=1) <--- ESSENCIAL
router.get('/', (req, res) => missaoController.getStatusUsuario(req, res));

// 2. Rota Paramétrica (Captura chamadas como /api/missoes/1)
router.get('/:userId', (req, res) => missaoController.getStatusUsuario(req, res));

module.exports = router;
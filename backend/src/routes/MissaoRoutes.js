const express = require('express');
const MissaoController = require('../controllers/MissaoController');

const router = express.Router();
const missaoController = new MissaoController(); 

// 1. App: Ver progresso
router.get('/', (req, res) => missaoController.getStatusUsuario(req, res));
router.get('/:userId', (req, res) => missaoController.getStatusUsuario(req, res));

// 2. Admin: Criar missão
router.post('/', (req, res) => missaoController.criar(req, res));

module.exports = router;
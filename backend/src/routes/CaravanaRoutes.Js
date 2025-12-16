const express = require('express');
const router = express.Router();
const CaravanaController = require('../controllers/CaravanaController');
const authMiddleware = require('../middleware/authMiddleware');

const caravanaController = new CaravanaController();

router.post('/', authMiddleware, async (req, res) => {
    await caravanaController.criarCaravana(req, res);
});

router.get('/', async (req, res) => {
    await caravanaController.listarCaravanas(req, res);
});

router.post('/:id/membros', async (req, res) => {
    await caravanaController.adicionarMembro(req, res);
});

router.get('/usuario/:usuarioId', authMiddleware, async (req, res) => {
    await caravanaController.listarPorUsuario(req, res);
});

router.get('/:id', async (req, res) => {
    await caravanaController.obterPorId(req, res);
});

router.post('/:id/destinos', async (req, res) => {
    await caravanaController.adicionarDestino(req, res);
});

router.delete('/:id', async (req, res) => {
    await caravanaController.removerCaravana(req, res);
});

router.get('/:id/multiplicador', async (req, res) => {
    await caravanaController.obterMultiplicador(req, res);
});

router.post('/entrar-com-codigo', authMiddleware, async (req, res) => {
    await caravanaController.entrarComCodigoAcesso(req, res);
});

module.exports = router;

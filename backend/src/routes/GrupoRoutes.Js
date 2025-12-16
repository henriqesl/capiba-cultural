const express = require('express');
const router = express.Router();

const GrupoController = require('../controllers/GrupoController');

const grupoController = new GrupoController();

router.post('/', async (req, res) => {
    await grupoController.criarGrupo(req, res);
});

router.get('/', async (req, res) => {
    await grupoController.listarGrupo(req, res);
});

router.get('/:id', async (req, res) => {
    await grupoController.obterPorId(req, res);
});

router.post('/:id/membros', async (req, res) => {
    await grupoController.adicionarMembro(req, res);
});

router.post('/atualizar-pontuacoes', async (req, res) => {
    await grupoController.atualizarPontuacoes(req, res);
});

router.post('/:id/encerrar', async (req, res) => {
    await grupoController.encerrarGrupo(req, res);
});

router.post('/verificar-expirados', async (req, res) => {
    await grupoController.verificarGruposExpirados(req, res);
});

router.delete('/:id', async (req, res) => {
    await grupoController.removerGrupo(req, res);
});

module.exports = router;

const express = require('express');
const router = express.Router();

const ReporteController = require('../controllers/ReporteController');

const reporteController = new ReporteController();

router.post('/', async (req, res) => {
    await reporteController.criarOuConfirmarReporte(req, res);
});

router.get('/', async (req, res) => {
    await reporteController.listarReportes(req, res);
});

router.get('/evento/:eventoId', async (req, res) => {
    await reporteController.listarPorEvento(req, res);
});

router.get('/usuario/:usuarioId', async (req, res) => {
    await reporteController.listarPorUsuario(req, res);
});

router.get('/mais-reportados', async (req, res) => {
    await reporteController.listarEventosMaisReportados(req, res);
});

router.delete('/:id', async (req, res) => {
    await reporteController.removerReporte(req, res);
});

module.exports = router;

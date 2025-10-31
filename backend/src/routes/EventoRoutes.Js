const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/EventoController');

const eventoController = new EventoController();

router.post('/', async (req, res) => {
    const { nome, local, data, descricao } = req.body;
    try {
        const evento = await eventoController.criarEvento(nome, local, data, descricao);
        res.status(201).json(evento);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const eventos = await eventoController.listarEventos();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const evento = await eventoController.obterPorId(id);
        if (!evento) {
            return res.status(404).json({ erro: 'Evento não encontrado' });
        }
        res.json(evento);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        await eventoController.removerEvento(id);
        res.json({ mensagem: 'Evento removido com sucesso' });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const CaravanaController = require('../controllers/CaravanaController');
const UsuarioController = require('../controllers/UsuarioController');
const EventoController = require('../controllers/EventoController');

const caravanaController = new CaravanaController();
const usuarioController = new UsuarioController();
const eventoController = new EventoController();

router.post('/', async (req, res) => {
    const { nome } = req.body;

    try {
        const caravana = await caravanaController.criarCaravana(nome);
        res.status(201).json({
            mensagem: `Caravana criada com sucesso: ${caravana.nome}`,
            caravana
        });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/:id/destinos', async (req, res) => {
    const { id } = req.params;
    const { eventoId } = req.body;

    try {
        const evento = await eventoController.obterPorId(Number(eventoId));
        if (!evento) return res.status(404).json({ erro: 'Evento não encontrado' });

        const caravana = await caravanaController.adicionarDestino(Number(id), evento);
        res.json({
            mensagem: `Evento ${evento.nome} adicionado como destino da caravana ${caravana.nome}`,
            caravana
        });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/:id/membros', async (req, res) => {
    const { id } = req.params;
    const { usuarioId } = req.body;

    try {
        const usuario = await usuarioController.obterPorId(Number(usuarioId));
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const caravana = await caravanaController.adicionarMembro(Number(id), usuario);
        res.json({
            mensagem: `Usuário ${usuario.nome} adicionado à caravana ${caravana.nome}`,
            caravana
        });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const caravanas = await caravanaController.listarCaravanas();
        res.json(caravanas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const caravana = await caravanaController.obterPorId(Number(id));
        if (!caravana) return res.status(404).json({ erro: 'Caravana não encontrada' });

        res.json(caravana);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const removida = await caravanaController.removerCaravana(Number(id));
        res.json({
            mensagem: `Caravana "${removida.nome}" removida com sucesso.`
        });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

module.exports = router;
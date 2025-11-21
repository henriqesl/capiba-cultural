const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

const usuarioController = new UsuarioController();

router.post('/', async (req, res) => {
    const { nome, email, senha, cpf } = req.body;
    try {
        const usuario = await usuarioController.criarUsuario(nome, email, senha, cpf);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await usuarioController.login(email, senha);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(401).json({ erro: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const usuarios = await usuarioController.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const usuario = await usuarioController.obterPorId(Number(req.params.id));
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ erro: 'Usuário não encontrado' });
    }
});

router.post('/:id/gastar', async (req, res) => {
    const { quantidade } = req.body;
    try {
        if (quantidade <= 0 || isNaN(quantidade)) {
            return res.status(400).json({ erro: 'Quantidade inválida' });
        }
        const usuario = await usuarioController.gastarMoedas(Number(req.params.id), quantidade);
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/:id/moedas', async (req, res) => {
    const { quantidade } = req.body;
    try {
        if (quantidade <= 0 || isNaN(quantidade)) {
            return res.status(400).json({ erro: 'Quantidade inválida' });
        }
        const usuario = await usuarioController.adicionarMoedas(Number(req.params.id), quantidade);
        res.json(usuario);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await usuarioController.removerUsuario(Number(req.params.id));
        res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});



module.exports = router;
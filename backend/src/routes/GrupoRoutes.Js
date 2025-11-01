const express = require('express');
const router = express.Router();

const GrupoController = require('../controllers/GrupoController');
const UsuarioController = require('../controllers/UsuarioController');

const grupoController = new GrupoController();
const usuarioController = new UsuarioController();

router.post('/', async (req, res) => {
    const { nome, dataInicio, dataFim } = req.body;
    try {
        const grupo = await grupoController.criarGrupo(nome, dataInicio, dataFim);
        res.status(201).json(grupo);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const grupos = await grupoController.listarGrupo();
        res.json(grupos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const grupo = await grupoController.obterPorId(id);
        if (!grupo) return res.status(404).json({ erro: 'Grupo não encontrado.' });
        res.json(grupo);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/:id/membros', async (req, res) => {
    const id = Number(req.params.id);
    const { usuarioId } = req.body;
    try {
        const usuario = await usuarioController.obterPorId(usuarioId);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const grupoAtualizado = await grupoController.adicionarMembro(id, usuario);
        res.json({ mensagem: `Usuário ${usuario.nome} adicionado ao grupo ${grupoAtualizado.nome}`, grupo: grupoAtualizado });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/atualizar-pontuacoes', async (req, res) => {
    try {
        const gruposAtualizados = await grupoController.atualizarPontuacoes();
        res.json({ 
            mensagem: "Pontuações atualizadas com sucesso!", 
            grupos: gruposAtualizados 
        });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/:id/encerrar', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const resultado = await grupoController.encerrarGrupo(id);
        res.json({ mensagem: 'Grupo encerrado.', resultado });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.post('/verificar-expirados', async (req, res) => {
    try {
        const fn = await grupoController.verificarGruposExpirados;
        if (!fn) throw new Error('Método verificarGruposExpirados não implementado no controller.');
        fn.call(grupoController);
        res.json({ mensagem: 'Verificação executada.' });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

router.delete('/:id',  async  (req, res)=> {
    const id = Number(req.params.id);
    try {
        const removido = await grupoController.removerGrupo(id);
        if (!removido) return res.status(404).json({ erro: 'Grupo não encontrado.' });
        res.json({ mensagem: 'Grupo removido com sucesso.' });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

module.exports = router;
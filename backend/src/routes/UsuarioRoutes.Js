const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/perfil/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const usuarioController = new UsuarioController();

router.post('/', upload.single('foto'), async (req, res) => {
    try {
        const imagemPerfilPath = req.file ? req.file.path : null;

        await usuarioController.criarUsuario(req, res, imagemPerfilPath);
    } catch (error) {
        console.error('Erro no upload ou na rota de registro:', error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao deletar arquivo após falha:', err);
            });
        }

        res.status(400).json({ erro: error.message });
    }
});

router.post('/login', async (req, res) => {
    await usuarioController.login(req, res);
});

router.get('/', async (req, res) => {
    await usuarioController.listarUsuarios(req, res);
});

router.get('/:id', async (req, res) => {
    await usuarioController.obterPorId(req, res);
});

router.put('/:id', upload.single('foto'), async (req, res) => {
    await usuarioController.atualizarUsuario(req, res);
});

router.post('/:id/gastar', async (req, res) => {
    await usuarioController.gastarMoedas(req, res);
});

router.post('/:id/moedas', async (req, res) => {
    await usuarioController.adicionarMoedas(req, res);
});

router.delete('/:id', async (req, res) => {
    await usuarioController.removerUsuario(req, res);
});

module.exports = router;

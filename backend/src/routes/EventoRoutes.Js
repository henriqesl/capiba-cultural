const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/EventoController');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const finalPath = path.join(__dirname, '..', '..', 'uploads');
        cb(null, finalPath);
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const eventoController = new EventoController();

router.post(
    '/',
    (req, res, next) => {
        next();
    },
    upload.single('imagemFile'),
    async (req, res) => {
        await eventoController.criarEvento(req, res);
    }
);

router.get('/', async (req, res) => {
    await eventoController.listarEventos(req, res);
});

router.get('/:id', async (req, res) => {
    await eventoController.obterPorId(req, res);
});

router.delete('/:id', async (req, res) => {
    await eventoController.removerEvento(req, res);
});

module.exports = router;

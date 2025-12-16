const express = require("express");
const router = express.Router();
const CaravanaController = require("../controllers/CaravanaController"); 
const authMiddleware = require("../middleware/authMiddleware"); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const finalPath = path.join(__dirname, '..', '..', 'uploads');
    console.log('Multer Destination Path:', finalPath);
    cb(null, finalPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


const caravanaController = new CaravanaController();

router.post("/", authMiddleware, upload.single('foto'), async (req, res) => {
  await caravanaController.criarCaravana(req, res);
});


router.get("/", async (req, res) => {
  await caravanaController.listarCaravanas(req, res);
});


router.post("/entrar", authMiddleware, async (req, res) => {
    await caravanaController.entrarComCodigoAcesso(req, res);
});


router.post("/:id/membros", async (req, res) => {
  await caravanaController.adicionarMembro(req, res);
});


router.get("/usuario/:usuarioId", authMiddleware, async (req, res) => {
  await caravanaController.listarPorUsuario(req, res);
});

router.get("/:id", async (req, res) => {
  await caravanaController.obterPorId(req, res);
});


router.post("/:id/destinos", async (req, res) => {
  await caravanaController.adicionarDestino(req, res);
});


router.delete("/:id", async (req, res) => {
  await caravanaController.removerCaravana(req, res);
});


router.get("/:id/multiplicador", async (req, res) => {
  await caravanaController.obterMultiplicador(req, res);
});

module.exports = router;
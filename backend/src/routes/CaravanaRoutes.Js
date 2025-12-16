const express = require("express");
const router = express.Router();
const CaravanaController = require("../controllers/CaravanaController"); 
const authMiddleware = require("../middleware/authMiddleware"); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const caravanaUploadDir = 'uploads/caravanas/';

// Cria a pasta se não existir
if (!fs.existsSync(caravanaUploadDir)) {
  fs.mkdirSync(caravanaUploadDir, { recursive: true });
}

const storageCaravana = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, caravanaUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'caravana-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadCaravana = multer({ storage: storageCaravana });


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

router.put("/:id", upload.single('foto'), async (req, res) => {
try {
    if (!req.file) {
      return res.status(400).json({ erro: "Nenhum arquivo enviado." });
    }

    // Caminho do arquivo
    const fotoPath = req.file.path;

    // Passa para o controller
    await caravanaController.atualizarCaravana(req, res, fotoPath);

  } catch (error) {
    console.error("Erro no upload de foto da caravana:", error);

    // Limpa arquivo em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Erro ao deletar arquivo após falha:", err);
      });
    }

    res.status(400).json({ erro: error.message });
  }
});


router.get("/:id/multiplicador", async (req, res) => {
  await caravanaController.obterMultiplicador(req, res);
});

module.exports = router;
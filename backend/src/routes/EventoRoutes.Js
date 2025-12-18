const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/EventoController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("imagemFile"), (req, res) =>
  eventoController.criarEvento(req, res),
);
router.get("/", (req, res) => eventoController.listarEventos(req, res));
router.get("/:id", (req, res) => eventoController.obterPorId(req, res));

router.put("/:id/aprovar", (req, res) =>
  eventoController.aprovarEvento(req, res),
);

router.delete("/:id", (req, res) => eventoController.removerEvento(req, res));

module.exports = router;

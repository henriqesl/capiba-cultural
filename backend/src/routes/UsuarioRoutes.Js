const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const finalPath = path.join(__dirname, "..", "..", "uploads");
    console.log("Multer Destination Path:", finalPath);
    cb(null, finalPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "pefil-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const usuarioController = new UsuarioController();

router.post(
  "/",
  (req, res, next) => {
    console.log("POST /eventos ROTA ATINGIDA. Tentando Multer...");
    next();
  },
  upload.single("foto"),
  async (req, res) => {
    await usuarioController.criarUsuario(req, res);
  },
);

router.post("/login", async (req, res) => {
  await usuarioController.login(req, res);
});

router.get("/", async (req, res) => {
  await usuarioController.listarUsuarios(req, res);
});

router.get("/:id", async (req, res) => {
  await usuarioController.obterPorId(req, res);
});

router.put("/:id", upload.single("foto"), async (req, res) => {
  await usuarioController.atualizarUsuario(req, res);
});

router.post("/:id/gastar", async (req, res) => {
  await usuarioController.gastarMoedas(req, res);
});

router.post("/:id/moedas", async (req, res) => {
  await usuarioController.adicionarMoedas(req, res);
});

router.delete("/:id", async (req, res) => {
  await usuarioController.removerUsuario(req, res);
});

module.exports = router;

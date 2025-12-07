const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/UsuarioController");

const usuarioController = new UsuarioController();

router.post("/", async (req, res) => {
  await usuarioController.criarUsuario(req, res);
});

router.post("/login", async (req, res) => {
  await usuarioController.login(req, res);
});

router.get("/", async (req, res) => {
  await usuarioController.listarUsuarios(req, res);
});

router.get("/:id", async (req, res) => {
  await usuarioController.obterPorId(req, res);
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

router.put("/:id", async (req, res) => {
  await usuarioController.atualizarUsuario(req, res);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const CaravanaController = require("../controllers/CaravanaController");

const caravanaController = new CaravanaController();

router.post("/", async (req, res) => {
  await caravanaController.criarCaravana(req, res);
});

router.get("/", async (req, res) => {
  await caravanaController.listarCaravanas(req, res);
});

router.get("/:id", async (req, res) => {
  await caravanaController.obterPorId(req, res);
});

router.post("/:id/membros", async (req, res) => {
  await caravanaController.adicionarMembro(req, res);
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

const express = require("express");
const router = express.Router();
const EventoController = require("../controllers/EventoController");

const eventoController = new EventoController();

router.post("/", async (req, res) => {
  await eventoController.criarEvento(req, res);
});

router.get("/", async (req, res) => {
  await eventoController.listarEventos(req, res);
});

router.get("/:id", async (req, res) => {
  await eventoController.obterPorId(req, res);
});

router.delete("/:id", async (req, res) => {
  await eventoController.removerEvento(req, res);
});

module.exports = router;

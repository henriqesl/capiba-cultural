const express = require("express");
const MissaoController = require("../controllers/MissaoController");

const router = express.Router();
const missaoController = new MissaoController();

router.get("/", (req, res) => missaoController.getStatusUsuario(req, res));
router.get("/:userId", (req, res) =>
  missaoController.getStatusUsuario(req, res),
);

router.post("/", (req, res) => missaoController.criar(req, res));

module.exports = router;

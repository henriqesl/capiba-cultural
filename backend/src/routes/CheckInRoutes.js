const express = require("express");
const CheckInController = require("../controllers/CheckInController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const checkInController = new CheckInController();

router.post("/", authMiddleware, (req, res) =>
  checkInController.realizarCheckIn(req, res),
);

router.get("/historico/:usuarioId", (req, res) =>
  checkInController.listarHistorico(req, res),
);

module.exports = router;

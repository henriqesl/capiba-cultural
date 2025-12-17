const express = require("express");
const CheckInController = require("../controllers/CheckInController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const checkInController = new CheckInController(); // Instancia aqui

// POST /api/checkin (Realizar check-in)
router.post("/", authMiddleware, (req, res) => checkInController.realizarCheckIn(req, res));

// GET /api/checkin/historico/:usuarioId (Histórico para Status Page)
router.get("/historico/:usuarioId", (req, res) => checkInController.listarHistorico(req, res));

module.exports = router;
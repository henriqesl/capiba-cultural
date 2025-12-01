const express = require("express");
const router = express.Router();
const CheckInController = require("../controllers/CheckInController");
const authMiddleware = require("../middleware/authMiddleware"); // Proteção

const checkInController = new CheckInController();

router.post("/", authMiddleware, async (req, res) => {
  const usuarioId = req.usuarioId;
  const { eventoId } = req.body;

  try {
    const resultado = await checkInController.realizarCheckIn(
      usuarioId,
      eventoId,
    );

    res.status(200).json({
      mensagem: "Check-in realizado com sucesso!",
      moedasGanhas: resultado.moedasGanhas,
      checkIn: resultado.checkIn,
    });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;

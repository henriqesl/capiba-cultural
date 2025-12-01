const express = require("express");
const router = express.Router();
const CheckInController = require("../controllers/CheckInController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware de autenticação

const checkInController = new CheckInController();

router.post("/", authMiddleware, async (req, res) => {
  await checkInController.realizarCheckIn(req, res);
});

module.exports = router;

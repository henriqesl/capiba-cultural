const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const caravanaRoutes = require("./routes/caravanaRoutes");
const eventoRoutes = require("./routes/eventoRoutes");
const grupoRoutes = require("./routes/grupoRoutes");
const reporteRoutes = require("./routes/reporteRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const checkInRoutes = require("./routes/checkInRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/caravanas", caravanaRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/grupos", grupoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/checkin", checkInRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.use((err, req, res, next) => {
  console.error("Erro:", err.stack);
  res.status(500).json({ erro: "Algo deu errado no servidor." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

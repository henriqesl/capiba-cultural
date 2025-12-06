const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const caravanaRoutes = require("./src/routes/CaravanaRoutes");
const eventoRoutes = require("./src/routes/EventoRoutes");
const grupoRoutes = require("./src/routes/GrupoRoutes");
const reporteRoutes = require("./src/routes/ReporteRoutes");
const usuarioRoutes = require("./src/routes/UsuarioRoutes");
const checkInRoutes = require("./src/routes/CheckInRoutes");

const authMiddleware = require("./src/middleware/authMiddleware");

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

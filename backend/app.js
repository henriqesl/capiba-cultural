const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
require("dotenv").config();

const caravanaRoutes = require("./src/routes/CaravanaRoutes");
const eventoRoutes = require("./src/routes/EventoRoutes");
const grupoRoutes = require("./src/routes/GrupoRoutes");
const reporteRoutes = require("./src/routes/ReporteRoutes");
const usuarioRoutes = require("./src/routes/UsuarioRoutes");
const checkInRoutes = require("./src/routes/CheckInRoutes");
const missaoRoutes = require("./src/routes/MissaoRoutes");

const authMiddleware = require("./src/middleware/authMiddleware");

const app = express();

const allowedOrigin = "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join('/app', 'uploads')));
app.use("/api/caravanas", caravanaRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/grupos", grupoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/missao", missaoRoutes);

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

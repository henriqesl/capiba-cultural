const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const caravanaRoutes = require("./src/routes/CaravanaRoutes");
const eventoRoutes = require("./src/routes/EventoRoutes");
const grupoRoutes = require("./src/routes/GrupoRoutes");
const reporteRoutes = require("./src/routes/ReporteRoutes");
const usuarioRoutes = require("./src/routes/UsuarioRoutes");
const checkInRoutes = require("./src/routes/CheckInRoutes");
const missaoRoutes = require("./src/routes/MissaoRoutes");

const app = express();

/* ===============================
   CORS
================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   PARSERS
================================ */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ===============================
   UPLOADS (FOTOS)
   -> ESSENCIAL pra imagem funcionar
================================ */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ===============================
   ROTAS
================================ */
app.use("/api/caravanas", caravanaRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/grupos", grupoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/missoes", missaoRoutes);

/* ===============================
   ROOT
================================ */
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

/* ===============================
   ERROS GLOBAIS
================================ */
app.use((err, req, res, next) => {
    console.log(`${req.method} ${req.url} - body:`, req.body);

  console.error("Erro:", err);
  res.status(500).json({
    erro: "Erro interno do servidor",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

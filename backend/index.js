const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const eventoRoutes = require('./src/routes/eventoRoutes');
const caravanaRoutes = require('./src/routes/caravanaRoutes');
const grupoRoutes = require('./src/routes/grupoRoutes');
const reporteRoutes = require('./src/routes/reporteRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/eventos', eventoRoutes);
app.use('/caravanas', caravanaRoutes);
app.use('/grupos', grupoRoutes);
app.use('/reportes', reporteRoutes);

app.get('/', (req, res) => {
    res.send(
        '🚀 API do Sistema Cultural está rodando! Use /usuarios, /eventos, /caravanas, /grupos, /reportes'
    );
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});

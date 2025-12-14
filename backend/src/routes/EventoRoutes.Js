const express = require("express");
const router = express.Router();
const EventoController = require("../controllers/EventoController");
const multer = require('multer');
const path = require('path'); 

// O path é obrigatório para path.join

// 🚨 CORREÇÃO 1: Removido 'c' duplicado
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     const finalPath = path.join(__dirname, '..', '..', 'uploads'); 

     console.log('Multer Destination Path:', finalPath); // DEBBUG
     cb(null, finalPath); 
   },
    
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
}); 

const upload = multer({ storage: storage });

const eventoController = new EventoController();

router.post("/", (req, res, next) => {
    // 🚨 ESTE LOG DEVE APARECER SE A ROTA FOR ATINGIDA.
    // Se este log NÃO aparecer, o erro é CORS ou a rota não está sendo mapeada corretamente.
    console.log("POST /eventos ROTA ATINGIDA. Tentando Multer...");
    next(); 
}, upload.single('imagemFile'), async (req, res) => {
    
    // 🚨 Log para checar o que o Multer fez!
    console.log("--- DEBUG APÓS MULTER ---");
    console.log("Req.body:", req.body); // Deve conter os campos de texto
    console.log("Req.file:", req.file); // Deve conter os dados do arquivo
    console.log("--------------------------");

    // A chamada ao Controller permanece
    await eventoController.criarEvento(req, res);
});

router.get("/", async (req, res) => {
  await eventoController.listarEventos(req, res);
});

router.get("/:id", async (req, res) => {
  await eventoController.obterPorId(req, res);
});

router.delete("/:id", async (req, res) => {
  await eventoController.removerEvento(req, res);
});

module.exports = router;

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

router.post("/", upload.single('imagemFile'), async (req, res) => {
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

const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path'); 
const fs = require('fs'); 

const UsuarioController = require("../controllers/UsuarioController");


const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'perfil');

// Cria o diretório se ele não existir (boa prática)
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR); 
    },
    filename: function (req, file, cb) {
        // Gera um nome de arquivo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        // Ex: 1734567890-1234-perfil.png
        cb(null, `${uniqueSuffix}-perfil${fileExtension}`);
    }
}); 

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Erro: O arquivo de imagem deve ser nos formatos JPG, PNG ou WEBP."), false);
    }
});

const usuarioController = new UsuarioController();

router.post("/", upload.single('imagemPerfil'), async (req, res) => {
    try {
        // req.file contém as informações do arquivo (caminho: req.file.path)
        // req.body contém os dados de texto (nome, email, senha, etc.)
        const imagemPerfilPath = req.file ? req.file.path : null; 

        // O Controller agora precisa receber o caminho do arquivo
        await usuarioController.criarUsuario(req, res, imagemPerfilPath);
        
    } catch (error) {
        // Se o Multer falhar (limite de tamanho, tipo de arquivo), ele lança um erro aqui.
        console.error("Erro no upload ou na rota de registro:", error);
        
        // 🚨 Se o upload foi feito e ocorreu um erro, precisamos limpar o arquivo!
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Erro ao deletar arquivo após falha:", err);
            });
        }
        
        res.status(400).json({ erro: error.message });
    }
});

router.post("/login", async (req, res) => {
  await usuarioController.login(req, res);
});

router.get("/", async (req, res) => {
  await usuarioController.listarUsuarios(req, res);
});

router.get("/:id", async (req, res) => {
  await usuarioController.obterPorId(req, res);
});

router.post("/:id/gastar", async (req, res) => {
  await usuarioController.gastarMoedas(req, res);
});

router.post("/:id/moedas", async (req, res) => {
  await usuarioController.adicionarMoedas(req, res);
});

router.delete("/:id", async (req, res) => {
  await usuarioController.removerUsuario(req, res);
});

module.exports = router;

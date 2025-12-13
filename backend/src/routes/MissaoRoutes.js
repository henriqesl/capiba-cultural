const express = require('express');
const MissaoController = require('../controllers/MissaoController');

const router = express.Router();

router.get('/:userId', MissaoController.getStatusUsuario); 

module.exports = router;
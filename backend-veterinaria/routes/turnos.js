const express = require('express');
const router = express.Router();
const { obtenerTurnos, crearTurno } = require('../controllers/turnosController');

router.get('/', obtenerTurnos);
router.post('/', crearTurno);

module.exports = router;

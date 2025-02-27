const express = require('express');
const router = express.Router();
const { obtenerVeterinarios } = require('../controllers/veterinariosController');

router.get('/', obtenerVeterinarios);

module.exports = router;

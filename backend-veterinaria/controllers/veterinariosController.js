const pool = require('../db');

const obtenerVeterinarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM veterinario');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { obtenerVeterinarios };

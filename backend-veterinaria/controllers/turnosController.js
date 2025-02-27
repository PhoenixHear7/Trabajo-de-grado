const pool = require('../db');

const obtenerTurnos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM turno');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const crearTurno = async (req, res) => {
    const { codigo, servicio, estado } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO turnos (codigo, servicio, estado) VALUES ($1, $2, $3) RETURNING *',
            [codigo, servicio, estado]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { obtenerTurnos, crearTurno };

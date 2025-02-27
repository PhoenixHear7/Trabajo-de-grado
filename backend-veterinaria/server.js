require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const turnosRoutes = require('./routes/turnos');
const veterinariosRoutes = require('./routes/veterinarios');

app.use('/turnos', turnosRoutes);
app.use('/veterinarios', veterinariosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});


-- Crear la tabla de mascotas (id como número de historia clínica)
CREATE TABLE mascotas (
    id INTEGER PRIMARY KEY,  -- Número de historia clínica ingresado manualmente
    nombre VARCHAR(100) NOT NULL
);

-- Crear la tabla de veterinarios
CREATE TABLE veterinarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Crear la tabla de turnosc
CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,
    modulo VARCHAR(50),
    servicio VARCHAR(100) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('espera', 'proceso', 'finalizado')) DEFAULT 'espera',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    veterinario_id INT,
    mascota_id INTEGER NOT NULL,  -- Ahora es INTEGER para coincidir con la tabla mascotas
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE SET NULL,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);




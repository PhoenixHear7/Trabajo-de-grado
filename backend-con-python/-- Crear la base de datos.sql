CREATE DATABASE Veterinaria;

-- Crear la tabla de mascotas
CREATE TABLE mascotas (
    id VARCHAR(20) PRIMARY KEY,  -- Cambiado de id_mascota a id
    nombre VARCHAR(100) NOT NULL
);

-- Crear la tabla de veterinarios
CREATE TABLE veterinarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Crear la tabla de turnos
CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,  -- Cambiado de id_turno a id
    codigo VARCHAR(10) NOT NULL,
    modulo VARCHAR(50) NULL,  
    servicio VARCHAR(100) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('espera', 'proceso', 'finalizado')) DEFAULT 'espera',
    fecha DATE DEFAULT CURRENT_DATE,  -- Manteniendo formato DATE para coincidir con el código
    veterinario_id INT NULL,  -- Cambiado de id_veterinario a veterinario_id
    mascota_id VARCHAR(20) NOT NULL,  -- Cambiado de id_mascota a mascota_id
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE SET NULL,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);

--http://192.168.10.30:5000/tv
--http://192.168.10.30:5000/pantallaPrincipal
--http://192.168.10.30:5000/moduloMedico
--http://LAPTOP-I0TPVS8T:5000/moduloMedico

--
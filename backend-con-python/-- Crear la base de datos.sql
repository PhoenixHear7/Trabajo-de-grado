-- Crear la base de datos
CREATE DATABASE Veterinaria;

-- Conectar a la base de datos (este comando es específico de psql)
\c Veterinaria;

-- Crear la tabla de mascotas
CREATE TABLE mascotas (
    id_mascota VARCHAR(20) PRIMARY KEY,
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
    id_turno SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL,
    modulo VARCHAR(50) NULL,  -- Cambiado de "módulo" a "modulo" para evitar caracteres especiales
    servicio VARCHAR(100) NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('espera', 'proceso', 'finalizado')) DEFAULT 'espera',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_veterinario INT NULL,
    id_mascota VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_veterinario) REFERENCES veterinarios(id) ON DELETE SET NULL,
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota) ON DELETE CASCADE
);

--http://192.168.10.30:5000/tv
--http://192.168.10.30:5000/pantallaPrincipal
--http://192.168.10.30:5000/moduloMedico
--
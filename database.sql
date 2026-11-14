-- Script de Base de Datos para Cerrajería Gustavo 2 (CG2)
-- Materia: Análisis de Sistemas Organizacionales - ISCA 4014
-- Alumno: Laureano Pérez

CREATE DATABASE IF NOT EXISTS `gestionventas_2026` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `gestionventas_2026`;

-- 1. Tabla de Usuarios (para el Login)
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `rol` VARCHAR(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 2. Tabla de Clientes (para el CRUD y Gestión de Clientes)
CREATE TABLE IF NOT EXISTS `clientes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(50) NOT NULL,
    `vehiculo_detalle` VARCHAR(150) NOT NULL,
    `ultimo_servicio` VARCHAR(150) NOT NULL,
    `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    `creado_el` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Inserción de usuarios de prueba (con contraseñas fáciles y legibles para probar)
INSERT INTO `usuarios` (`usuario`, `password`, `nombre`, `apellido`, `rol`) VALUES
('Gustavo Perez', 'CerrajeraiCG2', 'Gustavo', 'Perez', 'admin'),
('gustavo', '123456', 'Gustavo', 'Perez', 'admin'),
('Laureano Perez', '123456', 'Laureano', 'Perez', 'admin'),
('admin', 'admin', 'Administrador', 'CG2', 'admin')
ON DUPLICATE KEY UPDATE `password`=VALUES(`password`);

-- Inserción de datos iniciales de clientes tal como figuran en el informe ISCA4014
INSERT INTO `clientes` (`nombre`, `telefono`, `vehiculo_detalle`, `ultimo_servicio`, `estado`) VALUES
('Juan Pérez', '341-5551234', 'Ford Fiesta (Codificada)', 'Copia con chip', 'Activo'),
('Consorcio Belgrano', '3476-420011', 'Cerradura Llave Maestra', 'Cambio de combinación', 'Activo'),
('María Gómez', '341-6667890', 'Chevrolet Corsa', 'Apertura auxilio', 'Activo'),
('Julián González', '3476-437902', 'Chevrolet Cruze', 'Arreglo del Levantavidrios', 'Activo');

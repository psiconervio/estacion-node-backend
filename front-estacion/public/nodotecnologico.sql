-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 26-07-2024 a las 01:08:02
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.1.2-1ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nodotecnologico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Sector`
--

CREATE TABLE `Sector` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Sector`
--

INSERT INTO `Sector` (`id`, `name`, `status`) VALUES
('sectorA', 'A', 'ocupado'),
('sectorB', 'B', 'ocupado'),
('sectorC', 'C', 'libre'),
('sectorD', 'D', 'ocupado'),
('sectorE', 'E', 'reservado'),
('sectorF', 'F', 'libre'),
('sectorG', 'G', 'libre'),
('sectorH', 'H', 'ocupado'),
('sectorI', 'I', 'ocupado'),
('sectorJ', 'J', 'reservado'),
('sectorK', 'K', 'ocupado'),
('sectorP', 'P', 'libre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sectors`
--

CREATE TABLE `sectors` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('libre','ocupado','reservado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `sectors`
--

INSERT INTO `sectors` (`id`, `name`, `status`) VALUES
(1, 'sectorA', 'libre'),
(2, 'sectorB', 'ocupado'),
(3, 'sectorC', 'reservado'),
(4, 'sectorD', 'reservado'),
(5, 'sectorF', 'reservado'),
(6, 'sectorG', 'reservado'),
(7, 'sectorH', 'reservado'),
(8, 'sectorI', 'reservado'),
(9, 'sectorJ', 'reservado'),
(10, 'sectorK', 'reservado'),
(11, 'sectorP', 'reservado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Sector`
--
ALTER TABLE `Sector`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `sectors`
--
ALTER TABLE `sectors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

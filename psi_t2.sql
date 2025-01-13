-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 13-Jan-2025 às 12:02
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `psi_t2`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `songs`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `artist` varchar(50) NOT NULL,
  `album` varchar(50) DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `duration_secs` varchar(50) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `songs`
--

INSERT INTO `songs` (`id`, `title`, `artist`, `album`, `genre`, `duration_secs`, `release_date`, `likes`, `created_at`) VALUES
(1, 'Requiem', 'Avenged Sevenfold', 'Hail to the King', 'Rock/Metal', '461', '2013-08-23', 28676178, '2025-01-10 14:56:27'),
(2, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', '0000-00-00', 0, '2025-01-10 15:57:26'),
(3, 'Gunslinger', 'Avenged Sevenfold', 'Avenged Sevenfold', 'Rock/Metal', '252', '2007-10-30', 127165539, '2025-01-10 16:22:40');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

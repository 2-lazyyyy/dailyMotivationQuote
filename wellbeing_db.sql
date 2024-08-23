-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 23, 2024 at 02:20 PM
-- Server version: 10.6.18-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wellbeing_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'tko', '$2y$10$dSH8krwtxBhykiyoIaGFYOzaDVmYGF5DGLeMaDpMcImdzEJdX0uv2', '2024-08-16 19:08:25'),
(3, 'root', '$2y$10$w5qqFWpr2b.FcDniq9TnUuoxrKwnJEssA6nljTRXt5sAgn4wAiOPG', '2024-08-16 21:34:32'),
(4, 'ppk', '$2y$10$jyLeis48IPycNkiuBsRhHudC8b8PMFex3l7HEGHi4fPlJii1PQwfS', '2024-08-17 12:24:40');

-- --------------------------------------------------------

--
-- Table structure for table `wellbeing_scores`
--

CREATE TABLE `wellbeing_scores` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `happiness` decimal(3,1) DEFAULT NULL,
  `workload` decimal(3,1) DEFAULT NULL,
  `anxiety` decimal(3,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wellbeing_scores`
--

INSERT INTO `wellbeing_scores` (`id`, `user_id`, `date`, `happiness`, `workload`, `anxiety`) VALUES
(1, 1, '2024-08-17', '3.9', '1.2', '4.4'),
(2, 3, '2024-08-17', '2.0', '2.0', '3.0'),
(3, 4, '2024-08-17', '2.3', '0.0', '2.0'),
(4, 1, '2024-08-18', '2.3', '1.2', '2.4'),
(5, 4, '2024-08-18', '3.0', '2.0', '1.0'),
(6, 3, '2024-08-18', '2.0', '3.0', '5.0'),
(7, 1, '2024-08-19', '3.0', '2.0', '1.0'),
(8, 3, '2024-08-19', '1.0', '2.4', '5.0'),
(9, 1, '2024-08-22', '4.0', '3.5', '2.5'),
(10, 3, '2024-08-22', '1.2', '1.2', '1.0'),
(11, 1, '2024-08-23', '1.2', '1.3', '1.3');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `wellbeing_scores`
--
ALTER TABLE `wellbeing_scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`date`),
  ADD KEY `idx_user_id_date` (`user_id`,`date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wellbeing_scores`
--
ALTER TABLE `wellbeing_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `wellbeing_scores`
--
ALTER TABLE `wellbeing_scores`
  ADD CONSTRAINT `wellbeing_scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Database: `wellbeing_db`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Table structure for table `user`
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `user`
INSERT INTO `user` (`user_id`, `username`, `password`, `created_at`) VALUES
(1, 'tko', '$2y$10$dSH8krwtxBhykiyoIaGFYOzaDVmYGF5DGLeMaDpMcImdzEJdX0uv2', '2024-08-16 19:08:25'),
(3, 'root', '$2y$10$w5qqFWpr2b.FcDniq9TnUuoxrKwnJEssA6nljTRXt5sAgn4wAiOPG', '2024-08-16 21:34:32'),
(4, 'ppk', '$2y$10$jyLeis48IPycNkiuBsRhHudC8b8PMFex3l7HEGHi4fPlJii1PQwfS', '2024-08-17 12:24:40');

-- Table structure for table `wellbeing_scores`
CREATE TABLE `wellbeing_scores` (
  `scores_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `happiness` decimal(3,1) DEFAULT NULL,
  `workload_management` decimal(3,1) DEFAULT NULL,
  `anxiety` decimal(3,1) DEFAULT NULL,
  PRIMARY KEY (`scores_id`),
  UNIQUE KEY `user_id_date` (`user_id`, `date`),
  CONSTRAINT `wellbeing_scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `wellbeing_scores`
INSERT INTO `wellbeing_scores` (`scores_id`, `user_id`, `date`, `happiness`, `workload_management`, `anxiety`) VALUES
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

COMMIT;

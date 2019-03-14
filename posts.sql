-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2019 at 07:04 AM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.1.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `talksns`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` int(30) NOT NULL,
  `user_id` int(30) NOT NULL,
  `imageFile` text,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `imageFile`, `description`) VALUES
(1, 1, '340022.png', 'A1'),
(2, 2, '603132.png', 'A2'),
(3, 1, '936605.png', 'A3'),
(4, 1, '5278.png', 'A4'),
(5, 2, '930286.png', 'A5'),
(6, 1, '696557.png', 'A6'),
(7, 2, '', 'EVERYTHING DONE'),
(8, 1, '859935.jpg', NULL),
(9, 3, '778162.jpg', 'PUBG'),
(10, 3, '46248.jpg', 'highway'),
(11, 1, '198546.jpg', 'NATURE'),
(12, 11, '24811.jpg', 'khan car'),
(14, 3, '67371.png', NULL),
(15, 3, '', 'hello ............'),
(16, 3, '676978.jpg', 'Pindi Boyz'),
(17, 1, '996168.jpg', 'Dvision 2 Pic'),
(28, 1, '505630.jpg', NULL),
(29, 1, '88918.jpg', 'desert'),
(30, 1, '300361.jpg', 'nature'),
(31, 1, '586804.jpg', 'infinity stones'),
(32, 1, '615537.jpg', 'farcry NEW dawn'),
(33, 1, '116280.jpg', 'foggy'),
(34, 1, '629883.jpg', NULL),
(35, 1, '25856.jpg', 'ayubia'),
(36, 1, '41322.jpg', 'watar'),
(37, 1, '115329.jpg', NULL),
(38, 1, '918924.jpg', 'my ggaaari'),
(40, 2, '787851.jpg', NULL),
(41, 2, '24156.jpg', NULL),
(42, 2, '413050.jpg', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

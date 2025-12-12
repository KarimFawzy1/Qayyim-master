-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 10:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qayyim_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` varchar(191) NOT NULL,
  `courseCode` varchar(191) NOT NULL,
  `courseName` varchar(191) NOT NULL,
  `sectionType` enum('LECTURE','LAB','TUTORIAL') NOT NULL,
  `academicYear` varchar(191) NOT NULL,
  `semester` enum('FALL','SPRING','SUMMER') NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sectionNumber` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `courseCode`, `courseName`, `sectionType`, `academicYear`, `semester`, `isActive`, `sectionNumber`) VALUES
('clcourse001', 'CS101', 'Introduction to Computer Science', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clcourse002', 'CS101', 'Introduction to Computer Science', 'LAB', '2024-2025', 'FALL', 1, '001'),
('clcourse003', 'CS202', 'Data Structures and Algorithms', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clcourse004', 'CS202', 'Data Structures and Algorithms', 'LAB', '2024-2025', 'FALL', 1, '002'),
('clcourse005', 'MATH201', 'Calculus II', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clcourse006', 'MATH201', 'Calculus II', 'TUTORIAL', '2024-2025', 'FALL', 1, '001'),
('clcourse007', 'ENG301', 'Technical Writing', 'LECTURE', '2024-2025', 'SPRING', 1, '001'),
('clcourse008', 'CS303', 'Database Systems', 'LECTURE', '2024-2025', 'SPRING', 1, '001'),
('clcourse009', 'CS303', 'Database Systems', 'LAB', '2024-2025', 'SPRING', 1, '001'),
('clcourse010', 'PHY101', 'Physics I', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clxcourse001', 'CS101', 'Introduction to Computer Science', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clxcourse002', 'CS101', 'Introduction to Computer Science', 'LAB', '2024-2025', 'FALL', 1, '001'),
('clxcourse003', 'CS202', 'Data Structures and Algorithms', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clxcourse004', 'CS202', 'Data Structures and Algorithms', 'LAB', '2024-2025', 'FALL', 1, '002'),
('clxcourse005', 'MATH201', 'Calculus II', 'LECTURE', '2024-2025', 'FALL', 1, '001'),
('clxcourse006', 'MATH201', 'Calculus II', 'TUTORIAL', '2024-2025', 'FALL', 1, '001'),
('clxcourse007', 'ENG301', 'Technical Writing', 'LECTURE', '2024-2025', 'SPRING', 1, '001'),
('clxcourse008', 'CS303', 'Database Systems', 'LECTURE', '2024-2025', 'SPRING', 1, '001'),
('clxcourse009', 'CS303', 'Database Systems', 'LAB', '2024-2025', 'SPRING', 1, '001'),
('clxcourse010', 'PHY101', 'Physics I', 'LECTURE', '2024-2025', 'FALL', 1, '001');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(10) UNSIGNED DEFAULT NULL,
  `totalMarks` int(10) UNSIGNED DEFAULT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`questions`)),
  `type` enum('MCQ','TRUE_FALSE','SHORT_ANSWER','MIXED') NOT NULL,
  `deadline` datetime(3) DEFAULT NULL,
  `modelAnswer` text DEFAULT NULL,
  `rubric` text DEFAULT NULL,
  `modelAnswerFile` varchar(191) DEFAULT NULL,
  `rubricFile` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `courseId` varchar(191) DEFAULT NULL,
  `instructorId` varchar(191) NOT NULL,
  `rubricLink` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `userId`) VALUES
('cmhfehuu200027kic5hrxn5rm', 'cmhfehuiv00007kicjtc4h4zx');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `userId`) VALUES
('cmhfemzzt00057kicoeo82gdz', 'cmhfemzx600037kicc6lzbv8e');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` varchar(191) NOT NULL,
  `marks` int(10) UNSIGNED DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `status` enum('PENDING','GRADED') NOT NULL DEFAULT 'PENDING',
  `gradedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `studentId` varchar(191) NOT NULL,
  `examId` varchar(191) NOT NULL,
  `fileLink` varchar(191) NOT NULL,
  `originalAnswers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`originalAnswers`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `createdAt`, `updatedAt`) VALUES
('cmhfehuiv00007kicjtc4h4zx', 'mm@m.com', '$2b$10$zi8Orc.TM87XkZEVWDkdiO0H5sGjwh.zaFlvjFvBNDNS4frSY3Nr.', 'Mohamed Ahmed', '2025-10-31 22:04:09.800', '2025-11-28 20:55:10.614'),
('cmhfemzx600037kicc6lzbv8e', 'ymansy@gmail.com', '$2b$10$aL7amsJ4ZjaYMcimdxg.O.nbELb5R1baJCiLoeKeWEvsS1i2f9whW', 'Youssef Mohamed Mansy', '2025-10-31 22:08:10.074', '2025-11-28 18:41:26.808');

-- --------------------------------------------------------

--
-- Table structure for table `_courseinstructors`
--

CREATE TABLE `_courseinstructors` (
  `A` varchar(191) NOT NULL,
  `B` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_coursestudents`
--

CREATE TABLE `_coursestudents` (
  `A` varchar(191) NOT NULL,
  `B` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('c33c83c8-3ca2-46f7-bb7a-66f06bd157d4', '1ef2c1e6e9dea35dda93ff14e2cfe1530c6f06c405f01cdb080e8d64af5a785a', '2025-10-24 11:40:29.606', '20251020214708_init', NULL, NULL, '2025-10-24 11:40:22.338', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exams_createdAt_idx` (`createdAt`),
  ADD KEY `exams_instructorId_idx` (`instructorId`),
  ADD KEY `exams_courseId_idx` (`courseId`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `instructors_userId_key` (`userId`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_userId_key` (`userId`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `submissions_studentId_examId_key` (`studentId`,`examId`),
  ADD KEY `submissions_studentId_idx` (`studentId`),
  ADD KEY `submissions_examId_idx` (`examId`),
  ADD KEY `submissions_status_idx` (`status`),
  ADD KEY `submissions_gradedAt_idx` (`gradedAt`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `_courseinstructors`
--
ALTER TABLE `_courseinstructors`
  ADD UNIQUE KEY `_CourseInstructors_AB_unique` (`A`,`B`),
  ADD KEY `_CourseInstructors_B_index` (`B`);

--
-- Indexes for table `_coursestudents`
--
ALTER TABLE `_coursestudents`
  ADD UNIQUE KEY `_CourseStudents_AB_unique` (`A`,`B`),
  ADD KEY `_CourseStudents_B_index` (`B`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `exams_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `instructors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `instructors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `submissions_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_courseinstructors`
--
ALTER TABLE `_courseinstructors`
  ADD CONSTRAINT `_CourseInstructors_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_CourseInstructors_B_fkey` FOREIGN KEY (`B`) REFERENCES `instructors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `_coursestudents`
--
ALTER TABLE `_coursestudents`
  ADD CONSTRAINT `_CourseStudents_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `_CourseStudents_B_fkey` FOREIGN KEY (`B`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

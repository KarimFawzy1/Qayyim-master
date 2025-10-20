-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('TEACHER', 'STUDENT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `duration` INTEGER NULL,
    `totalMarks` INTEGER NULL,
    `questions` JSON NULL,
    `type` ENUM('MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'MIXED') NOT NULL,
    `deadline` DATETIME(3) NULL,
    `modelAnswer` TEXT NULL,
    `rubric` TEXT NULL,
    `modelAnswerFile` VARCHAR(191) NULL,
    `rubricFile` VARCHAR(191) NULL,
    `totalSubmissions` INTEGER NOT NULL DEFAULT 0,
    `gradedSubmissions` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `teacherId` VARCHAR(191) NOT NULL,

    INDEX `exams_teacherId_idx`(`teacherId`),
    INDEX `exams_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submissions` (
    `id` VARCHAR(191) NOT NULL,
    `originalAnswer` TEXT NOT NULL,
    `marks` INTEGER NULL,
    `feedback` TEXT NULL,
    `matchPercentage` DOUBLE NULL,
    `status` ENUM('PENDING', 'GRADED') NOT NULL DEFAULT 'PENDING',
    `gradedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `examId` VARCHAR(191) NOT NULL,

    INDEX `submissions_studentId_idx`(`studentId`),
    INDEX `submissions_examId_idx`(`examId`),
    INDEX `submissions_status_idx`(`status`),
    INDEX `submissions_gradedAt_idx`(`gradedAt`),
    UNIQUE INDEX `submissions_studentId_examId_key`(`studentId`, `examId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

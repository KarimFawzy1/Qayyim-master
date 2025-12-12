/*
  Warnings:

  - You are about to drop the column `gradedSubmissions` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `totalSubmissions` on the `exams` table. All the data in the column will be lost.
  - You are about to alter the column `duration` on the `exams` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `totalMarks` on the `exams` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to drop the column `matchPercentage` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `originalAnswer` on the `submissions` table. All the data in the column will be lost.
  - You are about to alter the column `marks` on the `submissions` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileLink` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalAnswers` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `exams_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `submissions` DROP FOREIGN KEY `submissions_studentId_fkey`;

-- DropIndex
DROP INDEX `exams_teacherId_idx` ON `exams`;

-- AlterTable
ALTER TABLE `exams` DROP COLUMN `gradedSubmissions`,
    DROP COLUMN `teacherId`,
    DROP COLUMN `totalSubmissions`,
    ADD COLUMN `courseId` VARCHAR(191) NULL,
    ADD COLUMN `instructorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `rubricLink` VARCHAR(191) NULL,
    MODIFY `duration` INTEGER UNSIGNED NULL,
    MODIFY `totalMarks` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `submissions` DROP COLUMN `matchPercentage`,
    DROP COLUMN `originalAnswer`,
    ADD COLUMN `fileLink` VARCHAR(191) NOT NULL,
    ADD COLUMN `originalAnswers` JSON NOT NULL,
    MODIFY `marks` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `role`;

-- CreateTable
CREATE TABLE `instructors` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `instructors_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `students_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` VARCHAR(191) NOT NULL,
    `courseCode` VARCHAR(191) NOT NULL,
    `courseName` VARCHAR(191) NOT NULL,
    `sectionType` ENUM('LECTURE', 'LAB', 'TUTORIAL') NOT NULL,
    `sectionNumber` VARCHAR(191) NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `semester` ENUM('FALL', 'SPRING', 'SUMMER') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `courses_courseCode_sectionType_academicYear_semester_section_key`(`courseCode`, `sectionType`, `academicYear`, `semester`, `sectionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseInstructors` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseInstructors_AB_unique`(`A`, `B`),
    INDEX `_CourseInstructors_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseStudents` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseStudents_AB_unique`(`A`, `B`),
    INDEX `_CourseStudents_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `exams_instructorId_idx` ON `exams`(`instructorId`);

-- CreateIndex
CREATE INDEX `exams_courseId_idx` ON `exams`(`courseId`);

-- AddForeignKey
ALTER TABLE `instructors` ADD CONSTRAINT `instructors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `instructors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseInstructors` ADD CONSTRAINT `_CourseInstructors_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseInstructors` ADD CONSTRAINT `_CourseInstructors_B_fkey` FOREIGN KEY (`B`) REFERENCES `instructors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseStudents` ADD CONSTRAINT `_CourseStudents_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseStudents` ADD CONSTRAINT `_CourseStudents_B_fkey` FOREIGN KEY (`B`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

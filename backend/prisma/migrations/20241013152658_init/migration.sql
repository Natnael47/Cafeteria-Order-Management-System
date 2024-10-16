-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(50) NOT NULL DEFAULT 'not selected',
    `address` JSON NOT NULL,
    `dob` VARCHAR(100) NOT NULL DEFAULT 'not selected',
    `phone` VARCHAR(20) NOT NULL DEFAULT '+251 911524856',
    `cartData` JSON NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

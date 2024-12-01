/*
  Warnings:

  - Made the column `prepTime` on table `food` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `totalAmount` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `food` MODIFY `prepTime` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `priority` VARCHAR(50) NOT NULL DEFAULT 'Normal';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `tax` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `orderLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `updatedBy` VARCHAR(255) NOT NULL,
    `changeTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comments` TEXT NULL,

    INDEX `OrderLog_orderId_fkey`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orderLog` ADD CONSTRAINT `orderLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

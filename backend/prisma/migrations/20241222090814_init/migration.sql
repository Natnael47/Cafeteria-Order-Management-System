-- DropForeignKey
ALTER TABLE `rating` DROP FOREIGN KEY `rating_foodId_fkey`;

-- AlterTable
ALTER TABLE `rating` MODIFY `foodId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

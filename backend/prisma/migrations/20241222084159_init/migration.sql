/*
  Warnings:

  - You are about to drop the column `drinkDrink_Id` on the `rating` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `rating` DROP FOREIGN KEY `rating_drinkDrink_Id_fkey`;

-- AlterTable
ALTER TABLE `rating` DROP COLUMN `drinkDrink_Id`,
    ADD COLUMN `drinkId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

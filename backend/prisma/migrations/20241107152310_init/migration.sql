/*
  Warnings:

  - You are about to alter the column `date` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `employee` MODIFY `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `status` VARCHAR(255) NOT NULL DEFAULT 'Order Placed';

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL;

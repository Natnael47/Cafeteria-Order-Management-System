/*
  Warnings:

  - You are about to drop the column `withdrawnBy` on the `withdrawallog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inventorypurchase` ADD COLUMN `employeeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `withdrawallog` DROP COLUMN `withdrawnBy`,
    ADD COLUMN `employeeId` INTEGER NULL,
    ADD COLUMN `reason` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `InventoryPurchase_employeeId_fkey` ON `inventorypurchase`(`employeeId`);

-- CreateIndex
CREATE INDEX `WithdrawalLog_employeeId_fkey` ON `withdrawallog`(`employeeId`);

-- AddForeignKey
ALTER TABLE `withdrawallog` ADD CONSTRAINT `withdrawallog_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventorypurchase` ADD CONSTRAINT `inventorypurchase_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `inventorypurchase` RENAME INDEX `inventorypurchase_inventoryId_fkey` TO `InventoryPurchase_inventoryId_fkey`;

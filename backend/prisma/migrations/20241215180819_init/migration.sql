/*
  Warnings:

  - You are about to drop the column `packageId` on the `inventoryrequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventoryrequest` DROP FOREIGN KEY `InventoryRequest_packageId_fkey`;

-- AlterTable
ALTER TABLE `inventoryrequest` DROP COLUMN `packageId`,
    ADD COLUMN `inventoryPackageId` INTEGER NULL,
    ADD COLUMN `withdrawalLogId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `InventoryRequest_withdrawalLogId_fkey` ON `inventoryrequest`(`withdrawalLogId`);

-- AddForeignKey
ALTER TABLE `inventoryrequest` ADD CONSTRAINT `InventoryRequest_withdrawalLogId_fkey` FOREIGN KEY (`withdrawalLogId`) REFERENCES `withdrawallog`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryrequest` ADD CONSTRAINT `inventoryrequest_inventoryPackageId_fkey` FOREIGN KEY (`inventoryPackageId`) REFERENCES `inventoryPackage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

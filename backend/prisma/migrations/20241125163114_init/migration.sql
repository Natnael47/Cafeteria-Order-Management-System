-- DropForeignKey
ALTER TABLE `inventorypurchase` DROP FOREIGN KEY `inventorypurchase_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `inventoryrequest` DROP FOREIGN KEY `InventoryRequest_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `supplierorder` DROP FOREIGN KEY `supplierorder_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `withdrawallog` DROP FOREIGN KEY `WithdrawalLog_inventoryId_fkey`;

-- AddForeignKey
ALTER TABLE `inventorypurchase` ADD CONSTRAINT `inventorypurchase_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplierorder` ADD CONSTRAINT `supplierorder_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryrequest` ADD CONSTRAINT `inventoryrequest_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `withdrawallog` ADD CONSTRAINT `withdrawallog_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

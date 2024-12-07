-- AlterTable
ALTER TABLE `inventorypackage` ADD COLUMN `chefId` INTEGER NULL,
    ADD COLUMN `packageType` VARCHAR(50) NOT NULL DEFAULT 'Order';

-- AlterTable
ALTER TABLE `inventoryrequest` ADD COLUMN `packageId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `InventoryPackage_chefId_fkey` ON `inventoryPackage`(`chefId`);

-- CreateIndex
CREATE INDEX `InventoryRequest_packageId_fkey` ON `inventoryrequest`(`packageId`);

-- AddForeignKey
ALTER TABLE `inventoryrequest` ADD CONSTRAINT `InventoryRequest_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `inventoryPackage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryPackage` ADD CONSTRAINT `InventoryPackage_chefId_fkey` FOREIGN KEY (`chefId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `inventorypackage` DROP FOREIGN KEY `InventoryPackage_supplierId_fkey`;

-- AlterTable
ALTER TABLE `inventorypackage` MODIFY `supplierId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `inventoryPackage` ADD CONSTRAINT `InventoryPackage_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

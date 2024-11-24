/*
  Warnings:

  - You are about to drop the column `supplier` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `inventorypurchase` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `supplierorder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventorypurchase` DROP FOREIGN KEY `InventoryPurchase_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `supplierorder` DROP FOREIGN KEY `SupplierOrder_inventoryId_fkey`;

-- DropIndex
DROP INDEX `inventory_id_idx` ON `inventory`;

-- AlterTable
ALTER TABLE `inventory` DROP COLUMN `supplier`,
    ADD COLUMN `supplierId` INTEGER NULL;

-- AlterTable
ALTER TABLE `inventorypurchase` DROP COLUMN `supplier`,
    ADD COLUMN `supplierId` INTEGER NULL;

-- AlterTable
ALTER TABLE `supplierorder` DROP COLUMN `supplier`,
    ADD COLUMN `supplierId` INTEGER NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `inventory` ADD CONSTRAINT `Inventory_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventorypurchase` ADD CONSTRAINT `inventorypurchase_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventorypurchase` ADD CONSTRAINT `inventorypurchase_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplierorder` ADD CONSTRAINT `supplierorder_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplierorder` ADD CONSTRAINT `supplierorder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

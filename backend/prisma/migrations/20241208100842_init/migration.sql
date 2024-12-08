/*
  Warnings:

  - Made the column `supplierId` on table `supplierorder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `supplierorder` DROP FOREIGN KEY `supplierorder_supplierId_fkey`;

-- AlterTable
ALTER TABLE `supplierorder` MODIFY `supplierId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `supplierorder` ADD CONSTRAINT `supplierorder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

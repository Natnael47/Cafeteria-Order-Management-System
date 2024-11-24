/*
  Warnings:

  - You are about to drop the `packageinventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `packageinventory` DROP FOREIGN KEY `PackageInventory_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `packageinventory` DROP FOREIGN KEY `PackageInventory_packageId_fkey`;

-- DropTable
DROP TABLE `packageinventory`;

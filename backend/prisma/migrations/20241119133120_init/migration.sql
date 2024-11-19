/*
  Warnings:

  - You are about to drop the column `requestedBy` on the `inventoryrequest` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `inventoryrequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventoryrequest` DROP COLUMN `requestedBy`,
    ADD COLUMN `employeeId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `InventoryRequest_employeeId_fkey` ON `inventoryrequest`(`employeeId`);

-- AddForeignKey
ALTER TABLE `inventoryrequest` ADD CONSTRAINT `InventoryRequest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

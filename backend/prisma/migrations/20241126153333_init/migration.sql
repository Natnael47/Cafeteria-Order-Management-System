-- AlterTable
ALTER TABLE `user` MODIFY `lastName` VARCHAR(255) NULL,
    MODIFY `gender` VARCHAR(50) NULL DEFAULT 'not selected',
    MODIFY `address` JSON NULL,
    MODIFY `dob` VARCHAR(100) NULL DEFAULT 'not selected',
    MODIFY `phone` VARCHAR(20) NULL DEFAULT '+251 911524856',
    MODIFY `cartData` JSON NULL;

-- RenameIndex
ALTER TABLE `inventoryrequest` RENAME INDEX `inventoryrequest_inventoryId_fkey` TO `InventoryRequest_inventoryId_fkey`;

-- RenameIndex
ALTER TABLE `withdrawallog` RENAME INDEX `withdrawallog_inventoryId_fkey` TO `WithdrawalLog_inventoryId_fkey`;

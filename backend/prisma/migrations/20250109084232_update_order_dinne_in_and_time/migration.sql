-- AlterTable
ALTER TABLE `order` ADD COLUMN `dineInTime` DATETIME(3) NULL,
    ADD COLUMN `serviceType` VARCHAR(50) NOT NULL DEFAULT 'Delivery',
    MODIFY `address` JSON NULL;

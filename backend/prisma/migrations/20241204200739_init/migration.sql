-- CreateTable
CREATE TABLE `StockBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchNumber` VARCHAR(50) NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `supplierId` INTEGER NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantityBought` INTEGER NOT NULL,
    `pricePerUnit` DOUBLE NOT NULL,
    `expiryDate` DATETIME(3) NULL,
    `quantityRemaining` INTEGER NOT NULL,

    UNIQUE INDEX `StockBatch_batchNumber_key`(`batchNumber`),
    INDEX `StockBatch_inventoryId_fkey`(`inventoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockBatch` ADD CONSTRAINT `StockBatch_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockBatch` ADD CONSTRAINT `StockBatch_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

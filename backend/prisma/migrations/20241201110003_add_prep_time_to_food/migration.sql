-- AlterTable
ALTER TABLE `food` ADD COLUMN `cookingStatus` VARCHAR(100) NULL DEFAULT 'Not Started',
    ADD COLUMN `prepTime` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `chefId` INTEGER NULL,
    ADD COLUMN `estimatedCompletionTime` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `orderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `foodId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `cookingStatus` VARCHAR(191) NOT NULL DEFAULT 'Not Started',
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orderItem` ADD CONSTRAINT `orderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderItem` ADD CONSTRAINT `orderItem_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

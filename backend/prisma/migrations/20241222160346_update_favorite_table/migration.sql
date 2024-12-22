-- AlterTable
ALTER TABLE `feedback` ADD COLUMN `lastUpdated` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `food` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `lastUpdated` DATETIME(3) NULL,
    ADD COLUMN `rating` DOUBLE NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `drinkId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `lastUpdated` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Drink` (
    `drink_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `drink_Name` VARCHAR(255) NOT NULL,
    `drink_Description` VARCHAR(255) NOT NULL,
    `drink_Price` DOUBLE NOT NULL,
    `drink_Image` VARCHAR(255) NOT NULL,
    `drink_Category` VARCHAR(255) NOT NULL,
    `is_Alcoholic` BOOLEAN NOT NULL DEFAULT false,
    `drink_Size` VARCHAR(50) NULL,
    `menu_Status` BOOLEAN NOT NULL DEFAULT true,
    `average_Rating` DOUBLE NULL DEFAULT 0.0,
    `created_At` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_Updated` DATETIME(3) NULL,

    PRIMARY KEY (`drink_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `foodId` INTEGER NULL,
    `rating` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `drinkId` INTEGER NULL,

    UNIQUE INDEX `Unique_user_food_rating`(`userId`, `foodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `foodId` INTEGER NULL,
    `drinkId` INTEGER NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NULL,

    UNIQUE INDEX `Unique_user_food_drink_favorite`(`userId`, `foodId`, `drinkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `foodId` INTEGER NULL,
    `customNote` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdated` DATETIME(3) NULL,
    `drinkId` INTEGER NULL,

    INDEX `Customization_userId_fkey`(`userId`),
    INDEX `Customization_foodId_fkey`(`foodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `Favorite_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `Favorite_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customization` ADD CONSTRAINT `Customization_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customization` ADD CONSTRAINT `Customization_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customization` ADD CONSTRAINT `customization_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderItem` ADD CONSTRAINT `orderItem_drinkId_fkey` FOREIGN KEY (`drinkId`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

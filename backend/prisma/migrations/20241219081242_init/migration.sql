-- AlterTable
ALTER TABLE `customization` ADD COLUMN `drinkDrink_Id` INTEGER NULL;

-- AlterTable
ALTER TABLE `favorite` ADD COLUMN `drinkDrink_Id` INTEGER NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `drinkDrink_Id` INTEGER NULL;

-- AlterTable
ALTER TABLE `rating` ADD COLUMN `drinkDrink_Id` INTEGER NULL;

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

-- AddForeignKey
ALTER TABLE `rating` ADD CONSTRAINT `rating_drinkDrink_Id_fkey` FOREIGN KEY (`drinkDrink_Id`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_drinkDrink_Id_fkey` FOREIGN KEY (`drinkDrink_Id`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customization` ADD CONSTRAINT `customization_drinkDrink_Id_fkey` FOREIGN KEY (`drinkDrink_Id`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderItem` ADD CONSTRAINT `orderItem_drinkDrink_Id_fkey` FOREIGN KEY (`drinkDrink_Id`) REFERENCES `Drink`(`drink_Id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `accountStatus` ENUM('ACTIVE', 'BANNED', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `work_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `loginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logoutTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `work_log` ADD CONSTRAINT `work_log_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

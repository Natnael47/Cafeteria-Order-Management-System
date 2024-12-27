/*
  Warnings:

  - You are about to alter the column `phone` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `phone` VARCHAR(15) NULL;

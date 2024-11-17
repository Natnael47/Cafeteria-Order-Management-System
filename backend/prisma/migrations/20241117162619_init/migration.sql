/*
  Warnings:

  - You are about to drop the column `payment` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `payment`,
    ADD COLUMN `isPaid` BOOLEAN NOT NULL DEFAULT false;

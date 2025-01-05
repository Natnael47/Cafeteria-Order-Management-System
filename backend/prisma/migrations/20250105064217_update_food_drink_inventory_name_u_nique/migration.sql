/*
  Warnings:

  - A unique constraint covering the columns `[drink_Name]` on the table `Drink` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `food` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Drink_drink_Name_key` ON `Drink`(`drink_Name`);

-- CreateIndex
CREATE UNIQUE INDEX `food_name_key` ON `food`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `inventory_name_key` ON `inventory`(`name`);

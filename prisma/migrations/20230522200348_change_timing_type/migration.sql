/*
  Warnings:

  - You are about to alter the column `cuisineType` on the `restaurant` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `VarChar(120)`.
  - You are about to alter the column `phoneNumber` on the `restaurant` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE `restaurant` MODIFY `cuisineType` VARCHAR(120) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(120) NOT NULL,
    MODIFY `openingTime` VARCHAR(120) NOT NULL,
    MODIFY `closingTime` VARCHAR(120) NOT NULL;

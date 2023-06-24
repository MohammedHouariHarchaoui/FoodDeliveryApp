/*
  Warnings:

  - Added the required column `idUser` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `idUser` INTEGER NOT NULL;

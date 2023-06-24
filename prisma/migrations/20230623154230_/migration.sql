/*
  Warnings:

  - Added the required column `backGroundImageUrl` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `backGroundImageUrl` VARCHAR(200) NOT NULL;

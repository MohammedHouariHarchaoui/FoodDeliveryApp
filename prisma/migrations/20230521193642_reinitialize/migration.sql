/*
  Warnings:

  - You are about to drop the column `status` on the `orderitems` table. All the data in the column will be lost.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `status` ENUM('PENDING', 'DELIVERED', 'CANCELED') NOT NULL;

-- AlterTable
ALTER TABLE `orderitems` DROP COLUMN `status`;

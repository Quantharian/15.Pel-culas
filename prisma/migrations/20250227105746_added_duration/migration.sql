/*
  Warnings:

  - Added the required column `duration` to the `films` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `films` ADD COLUMN `duration` INTEGER NOT NULL;

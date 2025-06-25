/*
  Warnings:

  - Added the required column `distance` to the `filters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filters" ADD COLUMN     "distance" TEXT NOT NULL;

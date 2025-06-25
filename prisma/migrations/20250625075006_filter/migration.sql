/*
  Warnings:

  - Added the required column `lat` to the `filters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `filters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filters" ADD COLUMN     "lat" TEXT NOT NULL,
ADD COLUMN     "lon" TEXT NOT NULL;

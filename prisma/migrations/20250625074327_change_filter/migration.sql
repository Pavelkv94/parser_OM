/*
  Warnings:

  - You are about to drop the column `fuel_type_first` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `fuel_type_second` on the `filters` table. All the data in the column will be lost.
  - Added the required column `fuel_type` to the `filters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filters" DROP COLUMN "fuel_type_first",
DROP COLUMN "fuel_type_second",
ADD COLUMN     "fuel_type" TEXT NOT NULL;

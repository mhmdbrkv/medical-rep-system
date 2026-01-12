/*
  Warnings:

  - You are about to drop the column `doctorId` on the `forecast` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "forecast" DROP CONSTRAINT "forecast_doctorId_fkey";

-- AlterTable
ALTER TABLE "forecast" DROP COLUMN "doctorId";

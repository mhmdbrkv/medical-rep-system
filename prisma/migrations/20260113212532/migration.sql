/*
  Warnings:

  - The `certificates` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('ROUTINE', 'FOLLOW_UP', 'EMERGENCY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT,
DROP COLUMN "certificates",
ADD COLUMN     "certificates" TEXT[];

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "visitType" "VisitType" NOT NULL DEFAULT 'ROUTINE';

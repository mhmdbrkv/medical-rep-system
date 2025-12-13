/*
  Warnings:

  - You are about to drop the column `Role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEDICAL_REP',
ALTER COLUMN "iqamaNumber" DROP NOT NULL,
ALTER COLUMN "passportNumber" DROP NOT NULL;

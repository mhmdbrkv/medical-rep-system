/*
  Warnings:

  - The `resume` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profileImage` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `certificates` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resume",
ADD COLUMN     "resume" JSONB,
DROP COLUMN "profileImage",
ADD COLUMN     "profileImage" JSONB,
DROP COLUMN "certificates",
ADD COLUMN     "certificates" JSONB[];

/*
  Warnings:

  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `actualVisitDate` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `distance` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `repId` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `repLatitude` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `repLocationUrl` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `repLongitude` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVisit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubRegion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('MANAGER', 'SUPERVISOR', 'MEDICAL_REP');

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_regionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVisit" DROP CONSTRAINT "ProductVisit_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVisit" DROP CONSTRAINT "ProductVisit_visitId_fkey";

-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubRegion" DROP CONSTRAINT "SubRegion_regionId_fkey";

-- DropForeignKey
ALTER TABLE "SubRegion" DROP CONSTRAINT "SubRegion_repId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_repId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
DROP COLUMN "role",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "position" "Position" NOT NULL DEFAULT 'MEDICAL_REP';

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "actualVisitDate",
DROP COLUMN "clientId",
DROP COLUMN "distance",
DROP COLUMN "notes",
DROP COLUMN "repId",
DROP COLUMN "repLatitude",
DROP COLUMN "repLocationUrl",
DROP COLUMN "repLongitude",
DROP COLUMN "scheduledDate",
DROP COLUMN "status";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductVisit";

-- DropTable
DROP TABLE "Region";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "SubRegion";

-- DropEnum
DROP TYPE "ClientType";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "RequestType";

-- DropEnum
DROP TYPE "Role";

/*
  Warnings:

  - You are about to drop the column `supervisorFeedBack` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.
  - Added the required column `LicenseNumber` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgPatientsPerDay` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iqamaNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passportNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'SUPERVISOR', 'MEDICAL_REP');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('EXPENSE', 'MARKETING', 'SAMPLE', 'LEAVE');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "LicenseNumber" TEXT NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "avgPatientsPerDay" INTEGER NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "practiceLocations" TEXT[],
ADD COLUMN     "regionId" TEXT NOT NULL,
ADD COLUMN     "specialty" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "supervisorFeedBack",
ADD COLUMN     "supervisorFeedback" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "position",
ADD COLUMN     "Role" "Role" NOT NULL DEFAULT 'MEDICAL_REP',
ADD COLUMN     "certificates" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateOfRecruitment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "educationBackground" TEXT,
ADD COLUMN     "iqamaNumber" TEXT NOT NULL,
ADD COLUMN     "passportNumber" TEXT NOT NULL,
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "subRegionId" TEXT;

-- DropEnum
DROP TYPE "Position";

-- CreateTable
CREATE TABLE "VisitReport" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "discussedTopics" TEXT NOT NULL,
    "doctorFeedback" TEXT,
    "visitPurpose" TEXT NOT NULL,
    "notes" TEXT,
    "samplesProvided" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "urgency" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "response" TEXT,
    "responseDate" TIMESTAMP(3),
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubRegion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubRegion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubRegion_regionId_key" ON "SubRegion"("regionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subRegionId_fkey" FOREIGN KEY ("subRegionId") REFERENCES "SubRegion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitReport" ADD CONSTRAINT "VisitReport_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubRegion" ADD CONSTRAINT "SubRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

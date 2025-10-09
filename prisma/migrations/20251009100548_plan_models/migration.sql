/*
  Warnings:

  - You are about to drop the column `userId` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repId` to the `Visit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitDate` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Plan" DROP CONSTRAINT "Plan_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Visit" DROP CONSTRAINT "Visit_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "date",
DROP COLUMN "notes",
DROP COLUMN "userId",
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "planDayId" TEXT,
ADD COLUMN     "repId" TEXT NOT NULL,
ADD COLUMN     "visitDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PlanDay" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "repId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanDay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDay" ADD CONSTRAINT "PlanDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDay" ADD CONSTRAINT "PlanDay_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_planDayId_fkey" FOREIGN KEY ("planDayId") REFERENCES "PlanDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

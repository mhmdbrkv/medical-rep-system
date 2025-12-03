/*
  Warnings:

  - You are about to drop the column `address` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `practiceLocations` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `userId` to the `VisitReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_regionId_fkey";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "address",
DROP COLUMN "practiceLocations",
DROP COLUMN "regionId";

-- AlterTable
ALTER TABLE "VisitReport" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_DoctorToRegion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DoctorToRegion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DoctorToRegion_B_index" ON "_DoctorToRegion"("B");

-- AddForeignKey
ALTER TABLE "VisitReport" ADD CONSTRAINT "VisitReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToRegion" ADD CONSTRAINT "_DoctorToRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToRegion" ADD CONSTRAINT "_DoctorToRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

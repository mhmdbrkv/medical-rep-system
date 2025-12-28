/*
  Warnings:

  - You are about to drop the column `userId` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the `_DoctorToRegion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `supervisorId` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_userId_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToRegion" DROP CONSTRAINT "_DoctorToRegion_A_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToRegion" DROP CONSTRAINT "_DoctorToRegion_B_fkey";

-- AlterTable
ALTER TABLE "Region" DROP COLUMN "userId",
ADD COLUMN     "supervisorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DoctorToRegion";

-- CreateTable
CREATE TABLE "_DoctorToSubRegion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DoctorToSubRegion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DoctorToSubRegion_B_index" ON "_DoctorToSubRegion"("B");

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToSubRegion" ADD CONSTRAINT "_DoctorToSubRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToSubRegion" ADD CONSTRAINT "_DoctorToSubRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "SubRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `date` to the `Visit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Visit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Visit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "samples" TEXT[],
ADD COLUMN     "status" "VisitStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

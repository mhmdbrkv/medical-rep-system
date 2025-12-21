/*
  Warnings:

  - You are about to drop the column `name` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Plan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetDoctors` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetVisits` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_userId_fkey";

-- DropIndex
DROP INDEX "Plan_name_key";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "repId" TEXT NOT NULL,
ADD COLUMN     "targetDoctors" INTEGER NOT NULL,
ADD COLUMN     "targetVisits" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_title_key" ON "Plan"("title");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

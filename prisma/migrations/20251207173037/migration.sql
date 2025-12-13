/*
  Warnings:

  - The `discussedTopics` column on the `VisitReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "VisitReport" DROP COLUMN "discussedTopics",
ADD COLUMN     "discussedTopics" TEXT[];

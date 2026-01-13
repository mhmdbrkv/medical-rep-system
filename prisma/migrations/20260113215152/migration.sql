-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_supervisorId_fkey";

-- AlterTable
ALTER TABLE "Region" ALTER COLUMN "supervisorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

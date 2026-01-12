-- DropForeignKey
ALTER TABLE "forecast" DROP CONSTRAINT "forecast_doctorId_fkey";

-- AlterTable
ALTER TABLE "forecast" ALTER COLUMN "doctorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "forecast" ADD CONSTRAINT "forecast_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

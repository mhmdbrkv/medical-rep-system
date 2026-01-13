-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "leaveDaysCount" INTEGER,
ADD COLUMN     "leaveEndDate" TIMESTAMP(3),
ADD COLUMN     "leaveStartDate" TIMESTAMP(3),
ADD COLUMN     "leaveType" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "leaveDaysCount" INTEGER DEFAULT 0,
ADD COLUMN     "leaveDaysTakenCount" INTEGER DEFAULT 0,
ADD COLUMN     "leaveEndDate" TIMESTAMP(3),
ADD COLUMN     "leaveStartDate" TIMESTAMP(3);

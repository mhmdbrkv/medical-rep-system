-- CreateTable
CREATE TABLE "CoachingReport" (
    "id" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "visitDuration" TEXT NOT NULL,
    "visitLocation" TEXT NOT NULL,
    "performanceRating" INTEGER NOT NULL,
    "visitPros" TEXT[],
    "visitCons" TEXT[],
    "recommendations" TEXT NOT NULL,
    "actionItems" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "repId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "CoachingReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoachingReport" ADD CONSTRAINT "CoachingReport_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingReport" ADD CONSTRAINT "CoachingReport_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingReport" ADD CONSTRAINT "CoachingReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

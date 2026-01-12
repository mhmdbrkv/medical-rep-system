-- CreateTable
CREATE TABLE "Appraisal" (
    "id" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "salesPerformance" DOUBLE PRECISION NOT NULL,
    "customerRelationships" DOUBLE PRECISION NOT NULL,
    "productKnowledge" DOUBLE PRECISION NOT NULL,
    "complianceAndRegulations" DOUBLE PRECISION NOT NULL,
    "teamworkAndCollaboration" DOUBLE PRECISION NOT NULL,
    "feedbackComments" TEXT,
    "repId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appraisal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appraisal" ADD CONSTRAINT "Appraisal_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appraisal" ADD CONSTRAINT "Appraisal_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

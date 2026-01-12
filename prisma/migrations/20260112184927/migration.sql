-- CreateTable
CREATE TABLE "forecast" (
    "id" TEXT NOT NULL,
    "repId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "periodDate" TIMESTAMP(3) NOT NULL,
    "productForecasts" JSONB[],
    "notes" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "supervisorFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecast_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "forecast" ADD CONSTRAINT "forecast_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast" ADD CONSTRAINT "forecast_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

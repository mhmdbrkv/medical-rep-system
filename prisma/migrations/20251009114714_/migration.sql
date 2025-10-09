/*
  Warnings:

  - You are about to drop the `PlanProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PlanProduct" DROP CONSTRAINT "PlanProduct_planId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlanProduct" DROP CONSTRAINT "PlanProduct_productId_fkey";

-- DropTable
DROP TABLE "public"."PlanProduct";

-- CreateTable
CREATE TABLE "_PlanToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlanToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlanToProduct_B_index" ON "_PlanToProduct"("B");

-- AddForeignKey
ALTER TABLE "_PlanToProduct" ADD CONSTRAINT "_PlanToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanToProduct" ADD CONSTRAINT "_PlanToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `cteatedAt` on the `LMTimesheetRecords` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sitecode]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LMTimesheetRecords" DROP COLUMN "cteatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "replacementNames" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Site_sitecode_key" ON "Site"("sitecode");

-- AddForeignKey
ALTER TABLE "LMTimesheetRecords" ADD CONSTRAINT "LMTimesheetRecords_siteCode_fkey" FOREIGN KEY ("siteCode") REFERENCES "Site"("sitecode") ON DELETE RESTRICT ON UPDATE CASCADE;

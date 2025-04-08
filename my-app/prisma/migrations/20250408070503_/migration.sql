/*
  Warnings:

  - You are about to drop the column `sitecode` on the `Site` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[siteCode]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numberOfPeople` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteCode` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteName` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LMTimesheetRecords" DROP CONSTRAINT "LMTimesheetRecords_siteCode_fkey";

-- DropIndex
DROP INDEX "Site_sitecode_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "sitecode",
ADD COLUMN     "numberOfPeople" INTEGER NOT NULL,
ADD COLUMN     "siteCode" TEXT NOT NULL,
ADD COLUMN     "siteName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Site_siteCode_key" ON "Site"("siteCode");

-- AddForeignKey
ALTER TABLE "LMTimesheetRecords" ADD CONSTRAINT "LMTimesheetRecords_siteCode_fkey" FOREIGN KEY ("siteCode") REFERENCES "Site"("siteCode") ON DELETE RESTRICT ON UPDATE CASCADE;

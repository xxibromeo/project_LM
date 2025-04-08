/*
  Warnings:

  - You are about to drop the column `sitecode` on the `LMTimesheetRecords` table. All the data in the column will be lost.
  - Added the required column `siteCode` to the `LMTimesheetRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteName` to the `LMTimesheetRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LMTimesheetRecords" DROP COLUMN "sitecode",
ADD COLUMN     "siteCode" TEXT NOT NULL,
ADD COLUMN     "siteName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "sitecode" TEXT NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_id_key" ON "Site"("id");

/*
  Warnings:

  - The `replacementNames` column on the `LMTimesheetRecords` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subSite]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dailyWorkingEmployees` to the `LMTimesheetRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subSite` to the `LMTimesheetRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminWage` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penaltyRate` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteSupervisorName` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subSite` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeSite` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LMTimesheetRecords" DROP CONSTRAINT "LMTimesheetRecords_siteCode_fkey";

-- DropIndex
DROP INDEX "LMTimesheetRecords_id_key";

-- DropIndex
DROP INDEX "Site_id_key";

-- DropIndex
DROP INDEX "Site_siteCode_key";

-- AlterTable
ALTER TABLE "LMTimesheetRecords" ADD COLUMN     "dailyWorkingEmployees" INTEGER NOT NULL,
ADD COLUMN     "subSite" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "replacementNames",
ADD COLUMN     "replacementNames" TEXT[];

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "adminWage" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "penaltyRate" INTEGER NOT NULL,
ADD COLUMN     "siteSupervisorName" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "subSite" TEXT NOT NULL,
ADD COLUMN     "typeSite" TEXT NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "admin";

-- CreateTable
CREATE TABLE "SiteDayOff" (
    "id" SERIAL NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subSite" TEXT NOT NULL,
    "siteCode" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "typeSite" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "penaltyRate" INTEGER NOT NULL,
    "workingPeople" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteDayOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_subSite_key" ON "Site"("subSite");

-- AddForeignKey
ALTER TABLE "LMTimesheetRecords" ADD CONSTRAINT "LMTimesheetRecords_subSite_fkey" FOREIGN KEY ("subSite") REFERENCES "Site"("subSite") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteDayOff" ADD CONSTRAINT "SiteDayOff_subSite_fkey" FOREIGN KEY ("subSite") REFERENCES "Site"("subSite") ON DELETE RESTRICT ON UPDATE CASCADE;

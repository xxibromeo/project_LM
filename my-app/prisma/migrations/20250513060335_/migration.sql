-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "penaltyRate" DROP NOT NULL,
ALTER COLUMN "penaltyRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SiteDayOff" ALTER COLUMN "penaltyRate" DROP NOT NULL,
ALTER COLUMN "penaltyRate" SET DATA TYPE DOUBLE PRECISION;

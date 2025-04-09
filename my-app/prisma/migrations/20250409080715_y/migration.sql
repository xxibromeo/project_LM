-- AlterTable
ALTER TABLE "LMTimesheetRecords" ALTER COLUMN "replacementNames" SET NOT NULL,
ALTER COLUMN "replacementNames" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "ID_employee" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");

-- CreateTable
CREATE TABLE "LMTimesheetRecords" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sitecode" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "workingPeople" INTEGER NOT NULL,
    "businessLeave" INTEGER NOT NULL,
    "sickLeave" INTEGER NOT NULL,
    "peopleLeave" INTEGER NOT NULL,
    "overContractEmployee" INTEGER NOT NULL,
    "replacementEmployee" INTEGER NOT NULL,
    "remark" TEXT NOT NULL,
    "cteatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "nameadmin" TEXT NOT NULL,

    CONSTRAINT "LMTimesheetRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LMTimesheetRecords_id_key" ON "LMTimesheetRecords"("id");

"use server";
import { prisma } from "@/lib/prisma";
import { LMTimesheetRecords } from "@prisma/client";

export type ILMTimesheetRecords = LMTimesheetRecords;
// ดึงข้อมูลทั้งหมด


export async function getAllTimesheets() {
  return await prisma.lMTimesheetRecords.findMany({
    orderBy: { date: "desc" },
  });
}

// อัปเดต Timesheet
export async function updateTimesheet(
  id: number,
  data: {
    subSite: string;
    siteCode: string;
    siteName: string;
    numberOfPeople: number;
    dailyWorkingEmployees:number;
    workingPeople: number;
    businessLeave: number;
    sickLeave: number;
    peopleLeave: number;
    overContractEmployee: number;
    replacementEmployee: number;
    replacementNames: string[];
    remark: string;
    nameadmin: string;
  }
) {
  return await prisma.lMTimesheetRecords.update({
    where: { id },
    data
  });
}

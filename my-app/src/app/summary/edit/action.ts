"use server";

import { prisma } from "@/lib/prisma"; // ดึง Prisma Client

// TypeScript Interface สำหรับข้อมูล Timesheet
interface TimesheetData {
  siteName: string;
  siteCode: string;
  numberOfPeople: number;
  dailyWorkingEmployees: number;
  workingPeople: number;
  businessLeave: number;
  sickLeave: number;
  peopleLeave: number;
  overContractEmployee: number;
  replacementEmployee: number;
  replacementNames: string[];
  remark: string;
}

// Update ข้อมูล Timesheet
export async function updateTimesheet(id: number, data: TimesheetData) {
  // ตรวจสอบข้อมูลก่อนทำการอัพเดต
  if (!data.siteName || !data.siteCode || data.numberOfPeople === undefined) {
    throw new Error("Missing required fields: siteName, siteCode, or numberOfPeople.");
  }

  try {
    const updated = await prisma.lMTimesheetRecords.update({
      where: { id },
      data: {
        siteName: data.siteName,
        siteCode: data.siteCode,
        numberOfPeople: data.numberOfPeople,
        workingPeople: data.workingPeople,
        dailyWorkingEmployees: data.dailyWorkingEmployees,
        businessLeave: data.businessLeave,
        sickLeave: data.sickLeave,
        peopleLeave: data.peopleLeave,
        overContractEmployee: data.overContractEmployee,
        replacementEmployee: data.replacementEmployee,
        replacementNames: data.replacementNames ?? [],  // default to empty array if null or undefined
        remark: data.remark ?? "",  // default to empty string if null or undefined
      },
    });

    return updated;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating timesheet:", error.message);
      throw new Error(`Error updating timesheet: ${error.message}`);
    } else {
      console.error("Unknown error occurred:", error);
      throw new Error("An unknown error occurred.");
    }
  }
}

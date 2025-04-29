"use server";

import { prisma } from "@/lib/prisma"; // สมมติคุณมี prisma instance ที่เชื่อมฐานข้อมูลไว้
import type { TimesheetData } from "./types"; // ✅

export async function updateTimesheet(id: number, data: Partial<TimesheetData>) {
  try {
    const updated = await prisma.lMTimesheetRecords.update({
      where: { id },
      data: {
        siteName: data.siteName,
        numberOfPeople: data.numberOfPeople,
        dailyWorkingEmployees: data.dailyWorkingEmployees,
        workingPeople: data.workingPeople,
        businessLeave: data.businessLeave,
        sickLeave: data.sickLeave,
        peopleLeave: data.peopleLeave,
        overContractEmployee: data.overContractEmployee,
        replacementEmployee: data.replacementEmployee,
        replacementNames: data.replacementNames ?? [],
        remark: data.remark ?? "",
      },
    });
    return updated;
  } catch (error) {
    console.error("Error updating timesheet:", error);
    return null;
  }
}

export async function getTimesheetById(id: number) {
  try {
    const data = await prisma.lMTimesheetRecords.findUnique({
      where: { id },
    });
    return data;
  } catch (error) {
    console.error("Error getting timesheet:", error);
    return null;
  }
}

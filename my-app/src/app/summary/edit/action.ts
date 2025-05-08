"use server";

import { prisma } from "@/lib/prisma";

export interface TimesheetData {
  id: number;
  date: Date;
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

export async function updateTimesheet(id: number, data: TimesheetData) {
  if (!data.siteName || !data.siteCode || data.numberOfPeople === undefined) {
    throw new Error("กรุณาระบุข้อมูลที่จำเป็น: siteName, siteCode, numberOfPeople");
  }

  try {
    const updated = await prisma.lMTimesheetRecords.update({
      where: { id },
      data: {
        siteName: data.siteName,
        siteCode: data.siteCode,
        numberOfPeople: data.numberOfPeople,
        dailyWorkingEmployees: data.dailyWorkingEmployees,
        workingPeople: data.workingPeople,
        businessLeave: data.businessLeave,
        sickLeave: data.sickLeave,
        peopleLeave: data.peopleLeave,
        overContractEmployee: data.overContractEmployee,
        replacementEmployee: data.replacementEmployee,
        replacementNames: data.replacementNames,
        remark: data.remark,
        date: data.date,
      },
    });

    return updated;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error updating timesheet:", error.message);
      throw new Error("ไม่สามารถบันทึกข้อมูลได้: " + error.message);
    }
    console.error("❌ Unknown error:", error);
    throw new Error("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
  }
}  

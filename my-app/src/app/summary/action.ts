import { prisma } from "@/lib/prisma"; // ปรับ path ให้ตรงกับโปรเจกต์คุณ

// สร้าง type สำหรับ TimesheetRecord และ UpdateTimesheetData
interface TimesheetRecord {
  id: number;
  date: Date; 
  siteCode: string;
  siteName: string;
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

interface UpdateTimesheetData {
  date: Date;
  siteCode: string;
  siteName: string;
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

// ฟังก์ชันอัปเดต timesheet
export async function updateTimesheet(id: number, data: UpdateTimesheetData) {
  try {
    const updated = await prisma.lMTimesheetRecords.update({
      where: { id },
      data,
    });
    return updated;
  } catch (error) {
    console.error("Error updating timesheet:", error);
    throw new Error("Failed to update timesheet");
  }
}

// ฟังก์ชันดึงข้อมูล timesheet โดยใช้ id
export async function getTimesheetById(id: number): Promise<TimesheetRecord | null> {
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

"use server";
import { PrismaClient, SiteDayOff } from "@prisma/client";

const prisma = new PrismaClient();

type TFormValue = {
  date: Date;
  subsite:string;
  siteName: string;
  siteCode: string;
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


};
export type ISite = SiteDayOff;

export const getAllSiteData = async () => await prisma.siteDayOff.findMany();

export const createTimeSheet = async (data: TFormValue) => {
  try {
    // ตรวจสอบว่าฟิลด์สำคัญมีค่าหรือไม่
    if (!data.siteCode || !data.date) {
      console.log(data);
      console.error("Required fields are missing.");
      return null; // ถ้าขาดฟิลด์สำคัญจะไม่บันทึก
    }

    // บันทึกข้อมูลลงใน Prisma
    const result = await prisma.lMTimesheetRecords.create({
      data: {
        date: data.date,
        subSite:data.subsite,
        siteCode: data.siteCode,
        siteName: data.siteName, // ตั้งค่า default เป็น "" ถ้าค่าหาย
        numberOfPeople: data.numberOfPeople || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        dailyWorkingEmployees:data.dailyWorkingEmployees||0,
        businessLeave: data.businessLeave || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        workingPeople: data.workingPeople || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        sickLeave: data.sickLeave || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        peopleLeave: data.peopleLeave || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        overContractEmployee: data.overContractEmployee || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        replacementEmployee: data.replacementEmployee || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        remark: data.remark || "", // ตั้งค่า default เป็น "" ถ้าค่าหาย
        nameadmin: data.nameadmin ?? "ไม่พบชื่อ", // เพิ่มมา
        replacementNames:data.replacementNames??[""],
      },
    });

    if (result) {
      return true;
    }
    return null;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    return null; // หากเกิดข้อผิดพลาดจาก Prisma จะ return null
  }
};

export async function getDailyWorkingPeople(subSite: string, date: string | Date) {
  const result = await prisma.siteDayOff.findFirst({
    where: {
      subSite,
      workDate: new Date(date),
    },
  });

  return result?.dailyWorkingEmployees ?? 0;
}

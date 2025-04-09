"use server";
import { PrismaClient, Site } from "@prisma/client";

const prisma = new PrismaClient();

type TFormValue = {
  nameadmin: string; 
  date: string;
  siteName: string;
  siteCode: string;
  businessLeave: number;
  numberOfPeople: number;
  workingPeople: number;
  sickLeave: number;
  peopleLeave: number;
  overContractEmployee: number;
  replacementEmployee: number;
  remark: string;
  replacementNames: string[];

};
export type ISite = Site;

export const getAllSiteData = async () => await prisma.site.findMany();

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
        siteCode: data.siteCode,
        businessLeave: data.businessLeave || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        numberOfPeople: data.numberOfPeople || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        workingPeople: data.workingPeople || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        sickLeave: data.sickLeave || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        peopleLeave: data.peopleLeave || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        overContractEmployee: data.overContractEmployee || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        replacementEmployee: data.replacementEmployee || 0, // ตั้งค่า default เป็น 0 ถ้าค่าหาย
        remark: data.remark || "", // ตั้งค่า default เป็น "" ถ้าค่าหาย
        nameadmin: data.nameadmin ?? "ไม่พบชื่อ", // เพิ่มมา
        replacementNames:data.replacementNames,
        siteName: data.siteName || "", // ตั้งค่า default เป็น "" ถ้าค่าหาย
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

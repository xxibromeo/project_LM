"use server";
import { PrismaClient, SiteDayOff } from "@prisma/client";

const prisma = new PrismaClient();

export type TFormValue = {
  date: Date;
  subSite: string;
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
  nameadmin: string;

};
export type ISite = SiteDayOff;

export const getAllSiteData = async () => await prisma.siteDayOff.findMany();

export const createTimeSheet = async (data: TFormValue) => {
  try {
    if (!data.siteCode || !data.date) {
      console.log(data);
      console.error("Required fields are missing.");
      return null;
    }

    const result = await prisma.lMTimesheetRecords.create({
      data: {
        date: data.date,
        subSite: data.subSite,
        siteCode: data.siteCode,
        siteName: data.siteName ?? "",
        numberOfPeople: data.numberOfPeople ?? 0,
        dailyWorkingEmployees: data.dailyWorkingEmployees ?? 0,
        businessLeave: isNaN(data.businessLeave) ? 0 : data.businessLeave,
        workingPeople: data.workingPeople ?? 0,
        sickLeave: isNaN(data.sickLeave) ? 0 : data.sickLeave,
        peopleLeave: isNaN(data.peopleLeave) ? 0 : data.peopleLeave,
        overContractEmployee: isNaN(data.overContractEmployee) ? 0 : data.overContractEmployee,
        replacementEmployee: data.replacementEmployee ?? 0,
        replacementNames: data.replacementNames ?? [""],
        remark: data.remark ?? "",
        nameadmin: data.nameadmin ?? "ไม่พบชื่อ",
      },
    });
    
  

    if (result) {
      return true;
    }
    return null;
  } catch (error) {
    console.error("Error creating timesheet:", error);
    return null;
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

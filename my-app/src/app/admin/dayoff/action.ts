"use server";
import { prisma } from "@/lib/prisma";

// ดึงข้อมูล SiteDayOff ทั้งหมด พร้อมข้อมูล Site
export async function getAllSiteDayOff() {
  return await prisma.siteDayOff.findMany({
    include: { site: true },
    orderBy: { workDate: "desc" },
  });
}

// เพิ่มข้อมูล SiteDayOff
export async function addSiteDayOff(data: {
  workDate: Date;
  subSite: string;
  siteCode: string;
  siteName: string;
  typeSite: string;
  numberOfPeople: number;
  penaltyRate: number;
  dailyWorkingEmployees: number;
}) {
  return await prisma.siteDayOff.create({
    data,
  });
}

// อัปเดตข้อมูล SiteDayOff
export async function updateSiteDayOff(id: number, data: {
  workDate: Date;
  subSite: string;
  siteCode: string;
  siteName: string;
  typeSite: string;
  numberOfPeople: number;
  penaltyRate: number;
  dailyWorkingEmployees: number;
}) {
  return await prisma.siteDayOff.update({
    where: { id },
    data,
  });
}

// ลบข้อมูล SiteDayOff
export async function deleteSiteDayOff(id: number) {
  return await prisma.siteDayOff.delete({
    where: { id },
  });
}

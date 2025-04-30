"use server";
import { prisma } from "@/lib/prisma";
// ดึงรายการ Site ทั้งหมด
export async function getAllSites() {
  return await prisma.site.findMany();
}

// เพิ่ม Site
export async function addSite(data: {

  siteCode: string;
  siteName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
  penaltyRate: number;
  typeSite: string;
  adminWage: string;
  siteSupervisorName: string;
  status?:string
}) {
  return await prisma.site.create({ data });
}

// แก้ไข Site
export async function updateSite(
  id: number,
  data: {
    siteCode: string;
    siteName: string;
    clientName: string;
    startDate: Date;
    endDate: Date;
    numberOfPeople: number;
    status?:string

  }
) {
  return await prisma.site.update({
    where: { id },
    data,
  });
}

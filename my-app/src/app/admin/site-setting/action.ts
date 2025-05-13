"use server";
import { prisma } from "@/lib/prisma";
// ดึงรายการ Site ทั้งหมด
export async function getAllSites() {
  return await prisma.site.findMany();
}

// เพิ่ม Site
export async function addSite(data: {
  subSite: string;
  siteCode: string;
  siteName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
  penaltyRate: number; // ทศนิยม 2 ตำแหน่ง
  typeSite: string;
  adminWage: string;
  siteSupervisorName: string;
  status: string;
}) {
  const payload = {
    ...data,
    penaltyRate: parseFloat(Number(data.penaltyRate).toFixed(2)), // ปรับเป็นทศนิยม 2 ตำแหน่ง
  };
  return await prisma.site.create({ data: payload });
}

// แก้ไข Site
export async function updateSite(
  id: number,
  data: {
    subSite: string;
    siteCode: string;
    siteName: string;
    clientName: string;
    startDate: Date;
    endDate: Date;
    numberOfPeople: number;
    penaltyRate: number; // ทศนิยม 2 ตำแหน่ง
    typeSite: string;
    adminWage: string;
    siteSupervisorName: string;
    status?: string;
  }
) {
  const payload = {
    ...data,
    penaltyRate: parseFloat(Number(data.penaltyRate).toFixed(2)), // ปรับเป็นทศนิยม 2 ตำแหน่ง
  };
  return await prisma.site.update({
    where: { id },
    data: payload,
  });
}

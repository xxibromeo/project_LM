"use server";
import { prisma } from "@/lib/prisma"
// ดึงรายการ Site ทั้งหมด
export async function getAllSites() {
  return await prisma.site.findMany();
}

// เพิ่ม Site
export async function addSite(data: { 
  siteCode: string; 
  siteName: string; 
  numberOfPeople: number 
}) {
  return await prisma.site.create({ data });
}

// แก้ไข Site
export async function updateSite(id: number, data: {
   siteCode: string; 
   siteName: string; 
   numberOfPeople: number }) {
  return await prisma.site.update({
    where: { id },
    data
  });
}

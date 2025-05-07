// src/importClearDayoff.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearDayoffData() {
  console.log('🧹 กำลังลบข้อมูล SiteDayOff ทั้งหมด...');
  await prisma.siteDayOff.deleteMany({});
  console.log('✅ ลบข้อมูล SiteDayOff เรียบร้อยแล้ว');
  await prisma.$disconnect();
}

clearDayoffData();

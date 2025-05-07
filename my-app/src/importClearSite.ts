import 'dotenv/config'; // ← เพิ่มบรรทัดนี้ที่ด้านบนสุด

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearSiteData() {
  await prisma.$connect();

  console.log('🧹 ลบข้อมูล Site...');
  await prisma.site.deleteMany({});
  console.log('✅ ลบ Site เรียบร้อย');

  await prisma.$disconnect();
}

clearSiteData();

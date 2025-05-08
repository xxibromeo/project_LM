// src/importDayoffExcel.ts

import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";
import dayjs from "dayjs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 86400000);
  }
  if (typeof value === "string") {
    const parsed = dayjs(value.trim(), ["D/M/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true);
    return parsed.isValid() ? parsed.toDate() : null;
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }
  return null;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function importExcel() {
  await prisma.$connect();
  console.log("🧹 ลบข้อมูล SiteDayOff เดิมทั้งหมด...");
  await prisma.siteDayOff.deleteMany({});
  console.log("✅ ลบข้อมูลเดิมเรียบร้อย\n");

  const filePath = path.join(__dirname, "../public/final_dayoff.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets["dim_dayoff"];
  const data: any[] = XLSX.utils.sheet_to_json(sheet);
  const chunks = chunkArray(data, 1000);
  let totalImported = 0;

  for (const [i, chunk] of chunks.entries()) {
    console.log(`📦 กำลังนำเข้าชุดที่ ${i + 1}/${chunks.length} (${chunk.length} แถว)`);
    for (const row of chunk) {
      const workDate = parseExcelDate(row.workDate);
      const subSite = row.subSite?.toString().trim() as string;

      if (!subSite || !row.siteCode || !row.siteName || !row.typeSite || !workDate) {
        console.warn(`⚠️ ข้ามแถว ID=${row.id} (ข้อมูลไม่ครบหรือวันผิด)`);
        continue;
      }

      const existingSite = await prisma.site.findUnique({ where: { subSite } });
      if (!existingSite) {
        console.warn(`⚠️ ข้าม ID=${row.id} เพราะ subSite=${subSite} ไม่อยู่ใน Site`);
        continue;
      }

      try {
        const c = await prisma.siteDayOff.create({
          data: {
            id: Number(row.id),
            subSite: subSite,
            siteCode: row.siteCode,
            siteName: row.siteName,
            typeSite: row.typeSite,
            numberOfPeople: row.numberOfPeople ? parseInt(row.numberOfPeople) : 0,
            penaltyRate: row.penaltyRate ? parseFloat(row.penaltyRate) : 0,
            workingPeople: row.workingPeople ? parseInt(row.workingPeople) : 0,
            workDate,
          },
        });
        totalImported++;
        console.log("นำเข้าข้อมูล : ", c.id, " subSite: ", c.subSite);
      } catch (error: any) {
        console.error(`❌ Error at ID=${row.id}:`, error.message);
      }
    }
  }

  console.log(`\n✅ นำเข้าสำเร็จทั้งหมด: ${totalImported} รายการ`);
  await prisma.$disconnect();
}

importExcel();

import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SiteDayOffRow {
  id: number;
  siteCode: string;
  siteName: string;
  subSite: string;
  typeSite: string;
  numberOfPeople: number;
  penaltyRate: number;
  workingPeople: number;
  workDate: Date; // อาจเป็น string หรือ number
}

// แปลง Excel date → JS Date
function parseExcelDate(dateValue: any): Date | null {
  if (!dateValue) return null;

  if (typeof dateValue === 'number') {
    const excelDate = XLSX.SSF.parse_date_code(dateValue);
    return new Date(excelDate.y, excelDate.m - 1, excelDate.d);
  }

  const parsed = new Date(dateValue);
  return isNaN(parsed.getTime()) ? null : parsed;
}

async function importExcel(filePath: string) {
  try {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: SiteDayOffRow[] = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {
      const parsedDate = parseExcelDate(row.workDate);

      if (!row.id || !row.siteCode || !parsedDate) {
        console.warn(`⚠️  ข้ามแถว ID=${row.id} (ข้อมูลไม่ครบหรือวันผิด)`);
        continue;
      }

      await prisma.siteDayOff.create({
        data: {
          id: row.id,
          siteCode: row.siteCode,
          siteName: row.siteName,
          subSite: row.subSite,
          typeSite: row.typeSite,
          numberOfPeople: Number(row.numberOfPeople),
          penaltyRate: Number(row.penaltyRate),
          workingPeople: Number(row.workingPeople),
          workDate: parsedDate,
        },
      });

      console.log(`✔️ Imported ID=${row.id}`);
    }

    console.log('✅ นำเข้าข้อมูลทั้งหมดสำเร็จ');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ (ใส่ path ไฟล์ Excel ของคุณให้ถูกต้อง)
importExcel('public/data_dictionary_LMdayoff.xlsx');

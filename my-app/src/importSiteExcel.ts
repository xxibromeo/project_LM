import { PrismaClient } from '@prisma/client';
import XLSX from 'xlsx';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dayjs from 'dayjs';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SiteRow {
  subSite: string;
  siteCode: string;
  siteName?: string;
  clientName?: string;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  numberOfPeople?: string | number;
  penaltyRate?: string | number;
  typeSite?: string;
  adminWage?: string;
  siteSupervisorName?: string;
  status?: string;
}

// ฟังก์ชันแปลงวันที่จาก Excel
function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;

  if (typeof value === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 86400000);
  }

  if (typeof value === 'string') {
    const parsed = dayjs(value.trim(), ['D/M/YYYY', 'DD/MM/YYYY'], true);
    return parsed.isValid() ? parsed.toDate() : null;
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  return null;
}

async function importSiteExcel() {
  await prisma.$connect();

  console.log('🧹 กำลังลบข้อมูล Site ทั้งหมด...');
  await prisma.site.deleteMany({});
  console.log('✅ ลบข้อมูล Site เรียบร้อยแล้ว\n');

  const filePath = path.join(__dirname, '../public/data_dictionary_LMsite.xlsx');
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['dim_site_detail'];

  if (!worksheet) {
    console.error('❌ ไม่พบชีตชื่อ "dim_site_detail"');
    return;
  }

  const data: SiteRow[] = XLSX.utils.sheet_to_json<SiteRow>(worksheet);
  let imported = 0;

  for (const row of data) {
    if (!row.subSite || !row.siteCode) {
      console.warn(`⚠️ ข้าม subSite=${row.subSite || 'undefined'} (ข้อมูลไม่ครบ)`);
      continue;
    }

    try {
      await prisma.site.create({
        data: {
          subSite: row.subSite,
          siteCode: row.siteCode,
          siteName: row.siteName || '',
          clientName: row.clientName || '',
          startDate: parseExcelDate(row.startDate) || undefined,
          endDate: parseExcelDate(row.endDate) || undefined,
          numberOfPeople: row.numberOfPeople ? parseInt(row.numberOfPeople.toString()) : 0,
          penaltyRate: row.penaltyRate ? parseFloat(row.penaltyRate.toString()) : 0,
          typeSite: row.typeSite || '',
          adminWage: row.adminWage || '',
          siteSupervisorName: row.siteSupervisorName || '',
          status: row.status || 'active',
        },
      });

      console.log(`✔️ Imported subSite=${row.subSite}`);
      imported++;
    } catch (error) {
      const err = error as Error;
      console.error(`❌ Error on subSite=${row.subSite}:`, err.message);
    }
  }

  console.log(`\n✅ นำเข้าสำเร็จทั้งหมด: ${imported} รายการ`);
  await prisma.$disconnect();
}

importSiteExcel();

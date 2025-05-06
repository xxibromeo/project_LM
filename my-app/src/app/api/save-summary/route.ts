import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // ใช้ req.json() เพื่อดึงข้อมูลจาก body
    console.log("Received data:", data);

    const existingRecord = await prisma.lMTimesheetRecords.findUnique({
      where: { id: data.id },
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({ error: "ไม่พบข้อมูลที่ต้องการอัพเดต" }),
        {
          status: 400,
        }
      );
    }

    const updatedData = await prisma.lMTimesheetRecords.update({
      where: { id: existingRecord.id },
      data: {
        date: new Date(data.date),
        siteCode: data.siteCode,
        siteName: data.siteName,
        numberOfPeople: data.numberOfPeople,
        dailyWorkingEmployees: data.dailyWorkingEmployees,
        workingPeople: data.workingPeople,
        businessLeave: data.businessLeave || 0,
        sickLeave: data.sickLeave || 0,
        peopleLeave: data.peopleLeave || 0,
        overContractEmployee: data.overContractEmployee || 0,
        replacementEmployee: data.replacementEmployee || 0,
        replacementNames: data.replacementNames,
        remark: data.remark || "",
      },
    });

    return new Response(JSON.stringify(updatedData), { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return new Response(JSON.stringify({ error: "ไม่สามารถบันทึกข้อมูลได้" }), {
      status: 500,
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: { Allow: "POST, OPTIONS" },
  });
}

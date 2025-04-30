import { prisma } from "@/lib/prisma"; // ปรับ path ให้ตรงกับโปรเจกต์คุณ

export async function updateTimesheet(id: number, data: any) {
  try {
    const updated = await prisma.lMTimesheetRecords.update({
      where: { id },
      data,
    });
    return updated;
  } catch (error) {
    console.error("Error updating timesheet:", error);
    throw new Error("Failed to update timesheet");
  }
}

export async function getTimesheetById(id: number) {
  try {
    const data = await prisma.lMTimesheetRecords.findUnique({
      where: { id },
    });
    return data;
  } catch (error) {
    console.error("Error getting timesheet:", error);
    return null;
  }
}

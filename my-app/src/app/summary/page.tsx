"use client";

import { useSearchParams } from "next/navigation";
import { Card, Button, Divider } from "antd";

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

  const parsedData = dataString
    ? JSON.parse(decodeURIComponent(dataString))
    : null;

  // ฟังก์ชันแปลงชื่อ field เป็นภาษาไทย
  const fieldMapping: { [key: string]: string } = {
    date: "วันที่",
    subSite: "Sub Site",
    siteCode: "Site Code",
    siteName: "ชื่อไซต์",
    numberOfPeople: "จำนวนพนักงานตามสัญญา",
    dailyWorkingEmployees: "พนักงานประจำที่มาทำงาน",
    workingPeople: "พนักงานที่ทำงานจริง",
    businessLeave: "ลากิจ",
    sickLeave: "ลาป่วย",
    peopleLeave: "ขาดงาน",
    overContractEmployee: "พนักงานเกินสัญญา",
    replacementEmployee: "จำนวนคนแทนงาน",
    replacementNames: "ชื่อคนแทนงาน",
    remark: "หมายเหตุ",
    nameadmin: "ชื่อแอดมิน",
  };

  // ฟังก์ชันแปลงค่าที่แสดง
  // ฟังก์ชันแปลงค่าที่แสดง
  const formatValue = (
    value: string | number | string[] | null | undefined
  ) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          สรุปข้อมูลที่บันทึกแล้ว
        </h1>

        {parsedData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(parsedData).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-500 text-sm">
                  {fieldMapping[key] ?? key}
                </p>
                <p className="text-lg font-semibold">
                  {formatValue(
                    value as string | number | string[] | null | undefined
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
        )}

        <Divider />

        <div className="flex justify-center gap-4 mt-6">
          <Button type="default" onClick={() => history.back()}>
            กลับไปแก้ไข
          </Button>
          <Button type="primary">ยืนยันข้อมูล</Button>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, Button, Divider } from "antd";
import Image from "next/image";

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get("data");

  const parsedData = dataString
    ? JSON.parse(decodeURIComponent(dataString))
    : null;

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
  };

  const formatValue = (
    value: string | number | string[] | null | undefined,
    key?: string
  ) => {
    if (key === "date" && typeof value === "string") {
      const date = new Date(value);
      return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    if (Array.isArray(value)) {
      // 🔥 เช็กถ้าเป็น replacementNames ให้ใส่ลำดับด้วย
      if (key === "replacementNames") {
        return value.map((name, index) => `${index + 1}. ${name}`).join("\n ");
      }
      return value.join("\n ");
    }
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };
  

  const goToEditPage = () => {
    if (parsedData) {
      router.push(
        `/summary/edit?data=${encodeURIComponent(JSON.stringify(parsedData))}`
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-SO.webp" alt="Logo" width={64} height={64} />
          <h1 className="text-2xl font-bold text-[#E30613] mt-4">
            สรุปข้อมูลที่บันทึกแล้ว
          </h1>
        </div>

        {parsedData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(parsedData)
              .filter(([key]) => key !== "nameadmin")
              .map(([key, value]) => (
                <div key={key}>
                  <p className="text-[#E30613] font-semibold text-base">
                    {fieldMapping[key] ?? key}
                  </p>
                  <p className="text-black text-base whitespace-pre-line">
                    {formatValue(
                      value as string | number | string[] | null | undefined,
                      key // ✨ ส่ง key เข้าไป
                    )}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
        )}

        <Divider className="my-10" />

        <div className="flex justify-center gap-6">
          <Button
            type="default"
            size="large"
            className="border-[#E30613] text-[#E30613]"
            onClick={goToEditPage}
          >
            แก้ไขข้อมูล
          </Button>
          <Button
            type="primary"
            size="large"
            className="bg-[#E30613] text-white border-none"
            onClick={() => router.push("/")}
          >
            ยืนยันข้อมูล
          </Button>
        </div>
      </Card>
    </div>
  );
}

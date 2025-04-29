"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, Button, Divider } from "antd";
import Image from "next/image";

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get("data");

  const parsedData = dataString ? JSON.parse(decodeURIComponent(dataString)) : null;

  const fieldMapping: { [key: string]: string } = {
    date: "วันที่",
    subSite: "Sub Site",
    siteCode: "Site Code",
    siteName: "ชื่อไซต์",
    numberOfPeople: "จำนวนพนักงานตามสัญญา",
    dailyWorkingEmployees: "พนักงานประจำที่มาทำงาน",
    workingPeople: "พนักงานที่ทำงานจริง",
    businessLeave: "ลากิจ (พนักงานประจำ)",
    sickLeave: "ลาป่วย (พนักงานประจำ)",
    peopleLeave: "ขาดงาน (พนักงานประจำ)",
    overContractEmployee: "พนักงานเกินสัญญา",
    replacementEmployee: "จำนวนคนแทนงาน",
    replacementNames: "ชื่อคนแทนงาน",
    remark: "หมายเหตุ",
  };

  const formatValue = (val: any, key?: string) => {
    if (key === "date") {
      const date = new Date(val);
      return date.toLocaleDateString("th-TH");
    }
    if (Array.isArray(val)) {
      const clean = val.filter((v) => v && v.trim() !== "");
      return clean.length > 0 ? clean.map((v, i) => `${i + 1}. ${v}`).join("\n") : "-";
    }
    if (val === null || val === undefined || val === "") return "-";
    return val;
  };

  if (!parsedData) {
    return <p className="text-center">ไม่พบข้อมูล</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-SO.webp" alt="Logo" width={64} height={64} />
          <h1 className="text-2xl font-bold text-[#E30613] mt-4">สรุปข้อมูลที่บันทึกแล้ว</h1>
        </div>

        {/* 📝 แสดงข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(parsedData)
            .filter(([k]) => k !== "nameadmin")
            .map(([k, v]) => (
              <div key={k}>
                <p className="text-[#E30613] font-semibold">{fieldMapping[k] ?? k}</p>
                <p className="text-black whitespace-pre-line">{formatValue(v, k)}</p>
              </div>
            ))}
        </div>

        <Divider className="my-10" />

        <div className="flex justify-center gap-6">
          <Button
            type="default"
            onClick={() =>
              router.push(`/summary/edit?data=${encodeURIComponent(JSON.stringify(parsedData))}`)
            }
          >
            แก้ไขข้อมูล
          </Button>
          <Button
            type="primary"
            onClick={() => router.push("/")}
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </Card>
    </div>
  );
}

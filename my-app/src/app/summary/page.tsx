"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import { signOut } from "next-auth/react";
import { formatThaiDate } from "@/utils/format";

// แก้ไขส่วนของการใช้ useSearchParams()
const SummaryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

  if (!dataString) return <p className="text-center">ไม่พบข้อมูล</p>;

  const parsedData = JSON.parse(decodeURIComponent(dataString));

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-4xl p-10">
        <div className="flex flex-col items-center">
          <Image src="/logo-SO.webp" alt="Logo" width={80} height={80} />
          <h1 className="text-lg text-red-600 font-bold my-2">
            สรุปข้อมูลที่บันทึกแล้ว
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 mt-6">
          <div className="space-y-2">
            <p className="text-red-600 font-bold">วันที่</p>
            <p>{formatThaiDate(parsedData.date)}</p>

            <p className="text-red-600 font-bold">Site Code</p>
            <p>{parsedData.siteCode || 0}</p>

            <p className="text-red-600 font-bold">ชื่อไซต์</p>
            <p>{parsedData.siteName || 0}</p>

            <p className="text-red-600 font-bold">พนักงานตามสัญญา</p>
            <p>{parsedData.numberOfPeople || 0}</p>

            <p className="text-red-600 font-bold">
              พนักงานประจำตามแผนส่งคนรายวัน
            </p>
            <p>{parsedData.workingPeople || 0}</p>

            <p className="text-red-600 font-bold">พนักงานประจำ(ที่มาทำงาน)</p>
            <p>{parsedData.dailyWorkingEmployees || 0}</p>

            <p className="text-red-600 font-bold">ลากิจ (พนักงานประจำ)</p>
            <p>{parsedData.businessLeave || 0}</p>

            <p className="text-red-600 font-bold">ขาดงาน (พนักงานประจำ)</p>
            <p>{parsedData.peopleLeave || 0}</p>
          </div>

          <div className="space-y-2">
            <p className="text-red-600 font-bold">ลาป่วย (พนักงานประจำ)</p>
            <p>{parsedData.sickLeave || 0}</p>

            <p className="text-red-600 font-bold">พนักงานเกินสัญญา</p>
            <p>{parsedData.overContractEmployee || 0}</p>

            <p className="text-red-600 font-bold">จำนวนคนแทนงาน</p>
            <p>{parsedData.replacementEmployee || 0}</p>

            <p className="text-red-600 font-bold">รายชื่อคนแทนงาน</p>
            {(parsedData.replacementNames || []).length > 0 ? (
              parsedData.replacementNames.map((name: string, idx: number) => (
                <p key={idx}>{name.trim() || "-"}</p>
              ))
            ) : (
              <p>-</p>
            )}

            <p className="text-red-600 font-bold">หมายเหตุ</p>
            <p>{parsedData.remark || " "}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <Button
            type="default"
            onClick={() => {
              const sanitizedData = {
                ...parsedData,
                date: dayjs(parsedData.date).format("YYYY-MM-DD"),
              };
              router.replace(
                `/summary/edit?data=${encodeURIComponent(
                  JSON.stringify(sanitizedData)
                )}`
              );
            }}
          >
            แก้ไขข้อมูล
          </Button>

          <Button
            type="primary"
            className="bg-blue-500"
            onClick={async () => {
              await signOut({ callbackUrl: "/" }); // เปลี่ยนเส้นทางไปที่หน้าแรก
            }}
          >
            ยืนยัน
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default function SummaryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SummaryContent />
    </Suspense>
  );
}

"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input, message } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { updateTimesheet, TimesheetData } from "./action";
import { formatThaiDate } from "@/utils/format";

dayjs.locale("th");

const EditSummaryPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

  const [form, setForm] = useState<TimesheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialReplacementCount, setInitialReplacementCount] = useState(0);

  useEffect(() => {
    if (dataString) {
      const parsed = JSON.parse(decodeURIComponent(dataString));

      // ตรวจสอบอย่างเข้มว่าเป็น array และไม่ใช่ [""]
      const isValidReplacement =
        Array.isArray(parsed.replacementNames) &&
        parsed.replacementNames.length > 0 &&
        parsed.replacementNames.some((name: string) => name.trim() !== "");

      const replacements = isValidReplacement ? parsed.replacementNames : [];

      setForm({
        ...parsed,
        date: dayjs(parsed.date).format("YYYY-MM-DD"),
        replacementNames: replacements,
      });

      setInitialReplacementCount(replacements.length);
    }
  }, [dataString]);

  if (!form) return <p className="text-center">ไม่พบข้อมูล</p>;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updated = await updateTimesheet(form.id, {
        ...form,
        date: new Date(form.date),
        replacementEmployee: form.replacementNames.length,
      });
      message.success("บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push(
        `/summary?data=${encodeURIComponent(JSON.stringify(updated))}`
      );
    } catch (error: unknown) {
      console.error(error);
      message.error("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReplacement = () => {
    const newList = [...form.replacementNames, ""];
    setForm({
      ...form,
      replacementNames: newList,
      replacementEmployee: newList.length,
    });
  };

  const handleRemoveReplacement = (index: number) => {
    if (index < initialReplacementCount) return;
    const updated = [...form.replacementNames];
    updated.splice(index, 1);
    setForm({
      ...form,
      replacementNames: updated,
      replacementEmployee: updated.length,
    });
  };

  const handleUpdateReplacement = (index: number, value: string) => {
    const updated = [...form.replacementNames];
    updated[index] = value;
    setForm({ ...form, replacementNames: updated });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-4xl p-10">
        <div className="flex flex-col items-center">
          <Image src="/logo-SO.webp" alt="Logo" width={80} height={80} />
          <h1 className="text-lg text-red-600 font-bold my-2">
            แก้ไขข้อมูลทั้งหมด
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 mt-6">
          <div className="space-y-2">
            <label className="text-red-600 font-bold">วันที่</label>
            <Input disabled type="text" value={formatThaiDate(form.date)} />

            <label className="text-red-600 font-bold">Site Code</label>
            <Input disabled value={form.siteCode} />

            <label className="text-red-600 font-bold">Site Name</label>
            <Input disabled value={form.siteName} />

            <label className="text-red-600 font-bold">พนักงานตามสัญญา</label>
            <Input disabled type="number" value={form.numberOfPeople} />

            <label className="text-red-600 font-bold">พนักงานตามแผน</label>
            <Input disabled type="number" value={form.workingPeople} />

            <label className="text-red-600 font-bold">
              พนักงานประจำ(ที่มาทำงาน)
            </label>
            <Input
              type="number"
              value={form.dailyWorkingEmployees}
              onChange={(e) =>
                setForm({
                  ...form,
                  dailyWorkingEmployees: Number(e.target.value),
                })
              }
            />

            <label className="text-red-600 font-bold">ลากิจ</label>
            <Input
              type="number"
              value={form.businessLeave}
              onChange={(e) =>
                setForm({ ...form, businessLeave: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-red-600 font-bold">ลาป่วย</label>
            <Input
              type="number"
              value={form.sickLeave}
              onChange={(e) =>
                setForm({ ...form, sickLeave: Number(e.target.value) })
              }
            />

            <label className="text-red-600 font-bold">ขาดงาน</label>
            <Input
              type="number"
              value={form.peopleLeave}
              onChange={(e) =>
                setForm({ ...form, peopleLeave: Number(e.target.value) })
              }
            />

            <label className="text-red-600 font-bold">เกินสัญญา</label>
            <Input
              type="number"
              value={form.overContractEmployee}
              onChange={(e) =>
                setForm({
                  ...form,
                  overContractEmployee: Number(e.target.value),
                })
              }
            />

            <label className="text-red-600 font-bold">จำนวนคนแทน</label>
            <Input
              disabled
              type="number"
              value={form.replacementNames.length}
            />

            <label className="text-red-600 font-bold">รายชื่อคนแทนงาน</label>
            {form.replacementNames.map((name, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={name}
                  onChange={(e) => handleUpdateReplacement(idx, e.target.value)}
                  className="flex-1"
                />
                {idx >= initialReplacementCount && (
                  <Button danger onClick={() => handleRemoveReplacement(idx)}>
                    ลบ
                  </Button>
                )}
              </div>
            ))}
            <br />
            <Button onClick={handleAddReplacement}>+ เพิ่มรายชื่อคนแทน</Button>
            <br />
            <label className="text-red-600 font-bold">หมายเหตุ</label>
            <Input
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="primary"
            className="bg-blue-500"
            loading={loading}
            onClick={handleSubmit}
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default function EditSummaryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditSummaryPageContent />
    </Suspense>
  );
}

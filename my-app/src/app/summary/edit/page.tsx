"use client"; // เพิ่มบรรทัดนี้ที่ด้านบนของไฟล์
import React, { useEffect } from "react";
import { Card, Button, Form, Input } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { TFormValue } from "@/app/action"; // ใช้ type ของข้อมูล

export default function EditSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const [form] = Form.useForm();

  const parsedData: TFormValue | null = dataString
    ? JSON.parse(decodeURIComponent(dataString))
    : null;

  console.log(
    "JSON.parse(decodeURIComponent(dataString))",
    JSON.parse(decodeURIComponent(dataString as string))
  );

  console.log('parsedData', parsedData)
  useEffect(() => {
    if (parsedData) {
      form.setFieldsValue({
        ...parsedData,
        date: dayjs(parsedData.date), // แปลงวันที่ให้แสดงในรูปแบบที่ต้องการ
      });
    }
  }, [form, parsedData]);

  const onFinish = async (values: TFormValue) => {
    const updatedData = {
      ...values,
      id: parsedData?.id ?? 0,
      date: values.date.toISOString(), // แปลงวันที่ให้เป็น ISO String
      // กำหนดค่าเป็น 0 ถ้าค่าใดเป็น null หรือ undefined
      businessLeave: values.businessLeave ?? 0,
      sickLeave: values.sickLeave ?? 0,
      peopleLeave: values.peopleLeave ?? 0,
      overContractEmployee: values.overContractEmployee ?? 0,
      replacementEmployee: values.replacementEmployee ?? 0,
      workingPeople: values.workingPeople ?? 0,
      numberOfPeople: values.numberOfPeople ?? 0,
    };
    // ส่งข้อมูลไปยัง API เพื่อบันทึกลงฐานข้อมูล
    try {
      const response = await fetch("/api/save-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // ส่งข้อมูลที่แก้ไขไป
      });

      const result = await response.json();
      if (response.ok) {
        // ถ้าสำเร็จให้แสดงผลและกลับไปที่หน้า summary
        router.push(
          `/summary?data=${encodeURIComponent(JSON.stringify(result))}`
        );
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error(error); // สำหรับ debug
      alert("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  if (!parsedData) return <p className="text-center">ไม่พบข้อมูล</p>;

  const formatThaiDate = (date: string | Date) =>
    dayjs(date).locale("th").format("D MMM YYYY"); // แปลงวันที่เป็นภาษาไทย

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-4xl p-10">
        <div className="flex flex-col items-center">
          <Image src="/logo-SO.webp" alt="Logo" width={80} height={80} />
          <h1 className="text-lg text-red-600 font-bold my-2">
            แก้ไขข้อมูลทั้งหมด
          </h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
            {/* ฝั่งซ้าย */}
            <div className="space-y-2">
              <Form.Item label="วันที่" name="date">
                <p className="text-red-600 font-bold">วันที่</p>
                <p>{formatThaiDate(parsedData.date)}</p>
              </Form.Item>

              <Form.Item label="Site Code" name="siteCode">
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="พนักงานตามสัญญา"
                name="numberOfPeople"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="พนักงานประจำ (ที่มาทำงาน)"
                name="dailyWorkingEmployees"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item label="ชื่อไซต์" name="siteName">
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="พนักงานประจำตามแผนส่งคนรายวัน"
                name="workingPeople"
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item label="ลากิจ (พนักงานประจำ)" name="businessLeave">
                <Input type="number" />
              </Form.Item>

              <Form.Item label="ขาดงาน (พนักงานประจำ)" name="peopleLeave">
                <Input type="number" />
              </Form.Item>
            </div>

            {/* ฝั่งขวา */}
            <div className="space-y-2">
              <Form.Item label="จำนวนคนแทนงาน" name="replacementEmployee">
                <Input type="number" />
              </Form.Item>

              <Form.Item label="ลาป่วย (พนักงานประจำ)" name="sickLeave">
                <Input type="number" />
              </Form.Item>

              <Form.Item label="พนักงานเกินสัญญา" name="overContractEmployee">
                <Input type="number" />
              </Form.Item>

              <Form.List name="replacementNames">
                {(fields) => (
                  <>
                    <p className="text-red-600 font-bold">ชื่อคนแทนงาน</p>
                    {fields.map((field) => (
                      <Form.Item {...field} key={field.key} name={[field.name]}>
                        <Input />
                      </Form.Item>
                    ))}
                  </>
                )}
              </Form.List>

              <Form.Item
                name="remark"
                label={<p className="text-red-600 font-bold">หมายเหตุ</p>}
              >
                <Input.TextArea rows={3} placeholder="กรุณากรอกหมายเหตุ" />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button htmlType="submit" type="primary" className="bg-blue-500">
              ยืนยัน
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

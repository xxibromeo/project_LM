"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, Form, Input, InputNumber, Button, Divider } from "antd";
import Image from "next/image"; // 📌 เพิ่ม import Image
import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

type FormValues = { [key: string]: unknown };

export default function EditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get("data");

  const parsedData = dataString
    ? JSON.parse(decodeURIComponent(dataString))
    : null;

  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    const updatedData = { ...parsedData, ...values };
    router.push(`/summary?data=${encodeURIComponent(JSON.stringify(updatedData))}`);
  };

  const formattedDate = parsedData?.date
    ? dayjs(parsedData.date).add(543, "year").format("D MMM YYYY")
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        {/* ✅ ใส่โลโก้และหัวข้อ */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-SO.webp" alt="Logo" width={64} height={64} />
          <h1 className="text-2xl font-bold text-[#E30613] mt-4">
            แก้ไขข้อมูล
          </h1>
        </div>

        {parsedData ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={parsedData}
            onFinish={onFinish}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Form.Item label="วันที่">
                <Input value={formattedDate} disabled />
              </Form.Item>

              <Form.Item label="ชื่อไซต์" name="siteName">
                <Input disabled />
              </Form.Item>

              <Form.Item label="จำนวนพนักงานตามสัญญา" name="numberOfPeople">
                <InputNumber disabled className="w-full" />
              </Form.Item>

              <Form.Item label="พนักงานประจำที่มาทำงาน" name="dailyWorkingEmployees">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="พนักงานที่ทำงานจริง" name="workingPeople">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="ลากิจ" name="businessLeave">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="ลาป่วย" name="sickLeave">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="ขาดงาน" name="peopleLeave">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="พนักงานเกินสัญญา" name="overContractEmployee">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="จำนวนคนแทนงาน" name="replacementEmployee">
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item label="ชื่อคนแทนงาน" name="replacementNames">
                <Input />
              </Form.Item>

              <Form.Item label="หมายเหตุ" name="remark">
                <Input />
              </Form.Item>
            </div>

            <Divider className="my-8" />

            <div className="flex justify-center gap-4">
              <Button type="default" onClick={() => router.back()}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                บันทึกข้อมูล
              </Button>
            </div>
          </Form>
        ) : (
          <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
        )}
      </Card>
    </div>
  );
}

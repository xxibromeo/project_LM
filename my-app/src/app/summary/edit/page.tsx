"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, Form, Input, InputNumber, Button, Divider } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/th";
import {  useState } from "react";

dayjs.locale("th");

type FormValues = { [key: string]: unknown };

export default function EditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get("data");

  const parsedData = dataString ? JSON.parse(decodeURIComponent(dataString)) : null;

  const [form] = Form.useForm();
  const [replacementNames, setReplacementNames] = useState<string[]>(parsedData?.replacementNames || []);

  const onFinish = (values: FormValues) => {
    const updatedData = { ...parsedData, ...values, replacementNames };
    router.push(`/summary?data=${encodeURIComponent(JSON.stringify(updatedData))}`);
  };

  const formattedDate = parsedData?.date
    ? dayjs(parsedData.date).add(543, "year").format("D MMM YYYY")
    : "";

  const onReplacementEmployeeChange = (value: number | null) => {
    if (value === null || value < 0) return;
    const current = [...replacementNames];
    if (value > current.length) {
      setReplacementNames([...current, ...Array(value - current.length).fill("")]);
    } else if (value < current.length) {
      setReplacementNames(current.slice(0, value));
    }
    form.setFieldsValue({ replacementEmployee: value });
  };

  const removeReplacementName = (index: number) => {
    const newList = [...replacementNames];
    newList.splice(index, 1);
    setReplacementNames(newList);
    form.setFieldsValue({ replacementEmployee: newList.length });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-SO.webp" alt="Logo" width={64} height={64} />
          <h1 className="text-2xl font-bold text-[#E30613] mt-4">แก้ไขข้อมูล</h1>
        </div>

        {parsedData ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              ...parsedData,
              replacementEmployee: replacementNames.length,
            }}
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
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item label="พนักงานที่ทำงานจริง" name="workingPeople">
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item label="ลากิจ" name="businessLeave">
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item label="ลาป่วย" name="sickLeave">
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item label="ขาดงาน" name="peopleLeave">
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item label="พนักงานเกินสัญญา" name="overContractEmployee">
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item label="จำนวนคนแทนงาน" name="replacementEmployee">
                <InputNumber
                  className="w-full"
                  min={0}
                  onChange={onReplacementEmployeeChange}
                />
              </Form.Item>

              {replacementNames.map((name, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Form.Item
                    label={`ชื่อคนแทนงาน ${index + 1}`}
                    name={['replacementNames', index]}
                    className="flex-1"
                    rules={[{ required: true, message: 'กรุณากรอกชื่อคนแทนงาน' }]}
                  >
                    <Input value={name} onChange={(e) => {
                      const updated = [...replacementNames];
                      updated[index] = e.target.value;
                      setReplacementNames(updated);
                    }} />
                  </Form.Item>
                  <Button danger onClick={() => removeReplacementName(index)}>ลบ</Button>
                </div>
              ))}

              <Form.Item label="หมายเหตุ" name="remark" className="col-span-2">
                <Input />
              </Form.Item>
            </div>

            <Divider className="my-8" />

            <div className="flex justify-center gap-4">
              <Button type="default" onClick={() => router.back()}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">บันทึกข้อมูล</Button>
            </div>
          </Form>
        ) : (
          <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
        )}
      </Card>
    </div>
  );
}

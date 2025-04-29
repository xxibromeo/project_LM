"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, Form, Input, InputNumber, Button, Divider, message } from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import { updateTimesheet } from "../action";

type TimesheetData = {
  id: number;
  siteName: string;
  numberOfPeople: number;
  dailyWorkingEmployees: number;
  workingPeople: number;
  businessLeave: number;
  sickLeave: number;
  peopleLeave: number;
  overContractEmployee: number;
  replacementEmployee: number;
  replacementNames: string[];
  remark?: string;
};

export default function EditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get("data");

  const parsedData: TimesheetData | null = dataString
    ? JSON.parse(decodeURIComponent(dataString))
    : null;

  const [form] = Form.useForm<TimesheetData>();
  const [replacementNames, setReplacementNames] = useState<string[]>(
    parsedData?.replacementNames?.length ? parsedData.replacementNames : []
  );

  useEffect(() => {
    if (parsedData) {
      form.setFieldsValue({
        ...parsedData,
        replacementEmployee: replacementNames.length,
      });
    }
  }, [parsedData, form, replacementNames.length]);

  const onFinish = async (values: TimesheetData) => {
    if (!parsedData?.id) {
      message.error("ไม่พบ ID ของ Timesheet");
      return;
    }

    const updatedData = {
      ...values,
      replacementNames: replacementNames.filter((name) => name.trim() !== ""),
    };

    const result = await updateTimesheet(parsedData.id, updatedData);

    if (result) {
      message.success("อัปเดตข้อมูลเรียบร้อย");
      router.push(`/summary?id=${parsedData.id}`);
    } else {
      message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

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
            onFinish={onFinish}
            initialValues={{
              ...parsedData,
              replacementEmployee: replacementNames.length,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* ข้อมูลทั่วไป */}
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

              {/* สถิติการลา */}
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

              {/* คนแทนงาน */}
              <Form.Item label="จำนวนคนแทนงาน" name="replacementEmployee">
                <InputNumber
                  className="w-full"
                  min={0}
                  onChange={onReplacementEmployeeChange}
                />
              </Form.Item>

              {/* ชื่อคนแทนงาน */}
              {replacementNames.length > 0 &&
                replacementNames.map((name, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Form.Item
                      label={`ชื่อคนแทนงาน ${index + 1}`}
                      name={['replacementNames', index]}
                      className="flex-1"
                      rules={[{ required: true, message: 'กรุณากรอกชื่อคนแทนงาน' }]}
                    >
                      <Input
                        value={name}
                        onChange={(e) => {
                          const updated = [...replacementNames];
                          updated[index] = e.target.value;
                          setReplacementNames(updated);
                        }}
                      />
                    </Form.Item>
                    <Button danger onClick={() => removeReplacementName(index)}>ลบ</Button>
                  </div>
                ))
              }

              {/* หมายเหตุ */}
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

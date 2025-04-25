"use client";

import { Card, Select, DatePicker, Button, Form, Input } from "antd";
import type { DatePickerProps } from "antd";
import TextArea from "antd/es/input/TextArea";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import dayjs, { Dayjs } from "dayjs";
import { createTimeSheet, getAllSiteData,ISite } from "./action";
import { useEffect, useState } from "react";

const { Option } = Select;

type TFormValue = {
  date: Date;
  subSite:string;
  siteCode: string;
  siteName:string;
  numberOfPeople: number;
  dailyWorkingEmployees:number;
  workingPeople: number;
  businessLeave: number;
  sickLeave: number;
  peopleLeave: number;
  overContractEmployee: number;
  replacementEmployee: number;
  replacementNames: string[];
  remark: string;
  nameadmin: string;
};

export default function RegisterForm() {
  const [form] = Form.useForm();
  const [replacementCount, setReplacementCount] = useState(0);
  const [siteData, setSiteData] = useState<ISite[]>([]);


  useEffect(() => {
    getSiteData();
  }, []);

  const getSiteData = async () => {
    const site = await getAllSiteData();
    setSiteData(site);
  };
  // ย้าย onSitechange มาประกาศภายใน component
  const onSitechange = (value: string) => {
    const selectedSite = siteData.find((site) => site.siteCode === value);
    form.setFieldsValue({ numberOfPeople: selectedSite?.numberOfPeople });
    form.setFieldsValue({ workingPeople: selectedSite?.numberOfPeople });
  };

  // ฟังก์ชันสำหรับคำนวณใหม่ทุกครั้งที่มีการเปลี่ยนแปลง
  const recalculateWorkingPeople = () => {
    const numberOfPeople = form.getFieldValue("numberOfPeople") || 0; //*อันนี้หมายถึงถ้าซ้ายมีค่าที่เป็นอย่างอื่นนอกจากตัวเลขให้คิดเป็น 0
    const businessLeave = form.getFieldValue("businessLeave") || 0;
    const sickLeave = form.getFieldValue("sickLeave") || 0;
    const peopleLeave = form.getFieldValue("peopleLeave") || 0;

    // คำนวณยอดพนักงานที่เหลือ
    const workingPeople =
      numberOfPeople - (businessLeave + sickLeave + peopleLeave);
    form.setFieldsValue({ workingPeople });
    console.log(businessLeave, sickLeave);
  };

  // กำหนดวันที่เป็นวันนี้ และไม่ให้แก้ไข
  const dateFormat = "DD-MM-YYYY";
  const today = dayjs();

  // ฟังก์ชันสำหรับเปลี่ยนแปลงจำนวนคนแทนงาน
  const onReplacementCountChange = (value: number | null) => {
    setReplacementCount(value || 0);
    // ถ้าจำนวนคนลดลง เคลียร์ค่าที่เกินออกจากฟอร์ม (ใน field replacementNames)
    const currentNames = form.getFieldValue("replacementNames") || [];
    if ((currentNames.length || 0) > (value ?? 0)) {
      form.setFieldsValue({
        replacementNames: currentNames.slice(0, value ?? 0),
      });
    }
  };

  // ฟังก์ชันเรียกใช้เมื่อกด Submit
  const onFinish = async (values: TFormValue) => {

    console.log("Form Values:", values);
    const save = await createTimeSheet({
      date: values.date?.toISOString() ?? new Date().toISOString(),
      subsite: values.subSite,
      siteCode: values.siteCode,
      siteName: siteData.find((i) => i.siteCode === values.siteCode)?.siteName ?? "",
      numberOfPeople: values.numberOfPeople?? 0,
      dailyWorkingEmployees: 0,
      workingPeople: values.workingPeople?? 0,
      businessLeave: values.businessLeave?? 0,
      sickLeave: values.sickLeave??0,
      peopleLeave: values.peopleLeave?? 0,
      overContractEmployee: values.overContractEmployee??0,
      replacementEmployee: values.replacementEmployee??0,
      replacementNames: values.replacementNames??[],
      remark: values.remark,
      nameadmin: "",
    });
    if (save) {
      form.resetFields();
      alert("ลงทะเบียนสำเร็จ");
    }
  };

  // ปิดการแก้ไข DatePicker (disabled)
  const disabledDatePicker: DatePickerProps["disabledDate"] = () => true;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-10">
        <h1 className="text-lg font-semibold mb-4 text-center">ลงทะเบียน</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            site: siteData, // เริ่มต้นเป็น site แรก
            date: today, // วันที่วันนี้
            remark: "",
          }}
        >
          {/* Select Site */}
          <Form.Item
            name="siteCode"
            label="กรุณาเลือก Site"
            rules={[{ required: true, message: "กรุณาเลือก Site" }]} //กฏที่เราต้องการให้ทำ
          >
            <Select placeholder="เลือก Site" onChange={onSitechange}>
              {siteData.map((site) => (
                <Option key={site.siteCode} value={site.siteCode}>
                  {site.siteName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Date Picker (disable edit) */}
          <Form.Item
            name="date"
            label="วันที่"
            rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}
          >
            <DatePicker
              size={"large"}
              color="red"
              format={dateFormat}
              disabled
              disabledDate={disabledDatePicker}
            />
          </Form.Item>

          {/* Number of People */}
          <Form.Item name="numberOfPeople" label="พนักงานประจำ (จากฐานข้อมูล)">
            <Input
              type="number"
              disabled
              size="large"
              min={1}
              className="w-1/2"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

          <Form.Item name="workingPeople" label="พนักงานประจำที่เหลือ">
            <Input
              type="number"
              disabled
              size="large"
              min={1}
              className="w-full"
              onChange={() => recalculateWorkingPeople()} //ถามข้อแตกต่างระหว่าง onchangeเฉยๆ
            />
          </Form.Item>

          {/*ลากิจ*/}
          <Form.Item name="businessLeave" label="ลากิจ">
            <Input
              type="number"
              size="large"
              min={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
              onChange={() => recalculateWorkingPeople()}
            />
          </Form.Item>

          {/*ลาป่วย*/}
          <Form.Item name="sickLeave" label="ลาป่วย">
            <Input
              type="number"
              size="large"
              min={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
              onChange={() => recalculateWorkingPeople()}
            />
          </Form.Item>

          {/*ขาดงาน*/}
          <Form.Item name="peopleLeave" label="ขาดงาน">
            <Input
              type="number"
              size="large"
              min={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
              onChange={() => recalculateWorkingPeople()}
            />
          </Form.Item>

          {/*พนักงานเกินสัญญา*/}
          <Form.Item name="overContractEmployee" label="พนักงานเกินสัญญา">
            <Input
              type="number"
              size="large"
              min={0}
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>
          {/*แทนงาน*/}
          <Form.Item name="replacementEmployee" label="แทนงาน">
            <Input
              type="number"
              size="large"
              min={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
              onChange={(e) => {
                // e: React.ChangeEvent<HTMLInputElement>
                // e.target.value เป็น string เสมอ
                const rawValue = e.target.value; // string
                const asNumber = rawValue === "" ? null : Number(rawValue);
                onReplacementCountChange(asNumber);
              }}
            />
          </Form.Item>
          {/* แสดง input field สำหรับกรอกชื่อคนแทนงาน ตามจำนวนที่เลือก */}
          {replacementCount > 0 &&
            Array.from({ length: replacementCount }, (_, index) => (
              <Form.Item
                key={index}
                name={["replacementNames", index]}
                label={`ชื่อคนแทนงาน ${index + 1}`}
                rules={[{ required: true, message: "กรุณากรอกชื่อคนแทนงาน" }]}
              >
                <Input
                  placeholder={`กรอกชื่อคนแทนงาน ${index + 1}`}
                  size="large"
                  className="w-full"
                />
              </Form.Item>
            ))}

          {/*หมายเหตุ*/}
          <Form.Item name="remark" label="หมายเหตุ">
            <TextArea rows={4} placeholder="หมายเหตุ" maxLength={6} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              ยืนยัน
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

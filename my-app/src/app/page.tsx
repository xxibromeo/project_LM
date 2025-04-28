"use client";

import { Card, Select, DatePicker, Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";

import type { DatePickerProps } from "antd";
import TextArea from "antd/es/input/TextArea";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import dayjs, { Dayjs } from "dayjs";
import { createTimeSheet, getAllSiteData, ISite } from "./action";
import { useEffect, useState } from "react";

const { Option } = Select;

type TFormValue = {
  date: Date;
  subSite: string;
  siteCode: string;
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

  const onSitechange = (subSite: string) => {
    const selectedDate = form.getFieldValue("date"); // ดึงวันที่ที่เลือกในฟอร์ม
    const selectedSite = siteData.find((SiteDayOff) => {
      return (
        SiteDayOff.subSite === subSite && // ใช้ subSite ตรงๆ
        dayjs(SiteDayOff.workDate).isSame(selectedDate, "day")
      );
    });

    form.setFieldsValue({
      numberOfPeople: selectedSite?.numberOfPeople ?? 0,
      workingPeople: selectedSite?.dailyWorkingEmployees ?? 0,
      siteName: selectedSite?.siteName ?? "", // ✅ ใส่ siteName ด้วย
    });
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
  const router = useRouter();

  const onFinish = async (values: TFormValue) => {
    const selectedDate = values.date;
    const selectedSite = siteData.find(
      (i) =>
        i.subSite === values.subSite &&
        dayjs(i.workDate).isSame(selectedDate, "day")
    );

    const dataToSend = {
      date: values.date,
      subSite: selectedSite?.subSite ?? "",
      siteCode: selectedSite?.siteCode ?? "",
      siteName: selectedSite?.siteName ?? "",
      numberOfPeople: Number(values.numberOfPeople) ?? 0,
      dailyWorkingEmployees: Number(values.dailyWorkingEmployees) ?? 0,
      workingPeople: Number(values.workingPeople) ?? 0,
      businessLeave: Number(values.businessLeave) ?? 0,
      sickLeave: Number(values.sickLeave) ?? 0,
      peopleLeave: Number(values.peopleLeave) ?? 0,
      overContractEmployee: Number(values.overContractEmployee) ?? 0,
      replacementEmployee: Number(values.replacementEmployee) ?? 0,
      replacementNames: values.replacementNames ?? [""],
      remark: typeof values.remark === "string" ? values.remark : "",
      nameadmin: "",
    };

    const save = await createTimeSheet(dataToSend);

    if (save) {
      form.resetFields();
      router.push(
        `/summary?data=${encodeURIComponent(JSON.stringify(dataToSend))}`
      );
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
            name="subSite" // ✅ ใช้ subSite เป็น value
            label="กรุณาเลือก Site"
            rules={[{ required: true, message: "กรุณาเลือก Site" }]}
          >
            <Select placeholder="เลือก Site" onChange={onSitechange}>
              {siteData.map((SiteDayOff) => (
                <Option key={SiteDayOff.subSite} value={SiteDayOff.subSite}>
                  {SiteDayOff.siteName}
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
          <Form.Item name="numberOfPeople" label="พนักงานตามสัญญา" >
            <Input
              type="number"
              disabled
              size="large"
              min={1}
              className="w-1/2"
            />
          </Form.Item>

          <Form.Item
            name="workingPeople"
            label="พนักงานปรนะจำตามแผนส่งคนรายวัน"
            
          >
            <Input
              type="number"
              disabled
              size="large"
              min={1}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="dailyWorkingEmployees"
            label="พนักงานประจำ (ที่มาทำงาน)"
            rules={[{ required: true}]}
          >
            <Input type="number" size="large" min={1} className="w-full" />
          </Form.Item>

          {/*ลากิจ*/}
          <Form.Item name="businessLeave" label="ลากิจ (พนักงานประจำ)">
            <Input
              type="number"
              size="large"
              min={0}
              defaultValue={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

          {/*ลาป่วย*/}
          <Form.Item name="sickLeave" label="ลาป่วย (พนักงานประจำ)">
            <Input
              type="number"
              size="large"
              min={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
              defaultValue={0}
            />
          </Form.Item>

          {/*ขาดงาน*/}
          <Form.Item name="peopleLeave" label="ขาดงาน (พนักงานประจำ)">
            <Input
              type="number"
              size="large"
              min={0}
              defaultValue={0}
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

          {/*พนักงานเกินสัญญา*/}
          <Form.Item name="overContractEmployee" label="พนักงานเกินสัญญา">
            <Input
              type="number"
              size="large"
              min={0}
              defaultValue={0}
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>
          {/*แทนงาน*/}
          <Form.Item name="replacementEmployee" label="จำนวนคนแทนงาน">
            <Input
              type="number"
              size="large"
              min={0}
              defaultValue={0}
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
                rules={replacementCount > 0 ? [{ required: true, message: "กรุณากรอกชื่อคนแทนงาน" }] : []}
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
            <TextArea rows={4} placeholder="หมายเหตุ" maxLength={200} />
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

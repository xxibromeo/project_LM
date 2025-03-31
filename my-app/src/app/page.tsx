'use client';

import { Card, Select, DatePicker, InputNumber, Button, Form } from 'antd';
import type { DatePickerProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';

const { Option } = Select;

export default function RegisterForm() {
  const [form] = Form.useForm();

  // ตัวอย่างข้อมูล site
  const sites = ['65LM-L-0011','65LM-L-0012','66LM-L-0004','68LM-L-0006'];

  // กำหนดวันที่เป็นวันนี้ และไม่ให้แก้ไข
  const dateFormat = 'DD-MM-YYYY';
  const today = dayjs();

  // ฟังก์ชันเรียกใช้เมื่อกด Submit
  const onFinish = (values: unknown) => {
    console.log('Form Values:', values);
    alert(JSON.stringify(values, null, 2));
  };

  // ปิดการแก้ไข DatePicker (disabled)
  const disabledDatePicker: DatePickerProps['disabledDate'] = () => true;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4">
        <h1 className="text-lg font-semibold mb-4 text-center">ลงทะเบียน</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            site: sites[0],       // เริ่มต้นเป็น site แรก
            date: today,          // วันที่วันนี้
            people: 0,            // ค่าจำนวนเริ่มต้น
          }}
        >
          {/* Select Site */}
          <Form.Item
            name="site"
            label="กรุณาเลือก Site"
            rules={[{ required: true, message: 'กรุณาเลือก Site' }]} //กฏที่เราต้องการให้ทำ
          >
            <Select placeholder="เลือก Site">
              {sites.map((site) => (
                <Option key={site} value={site}>
                  {site}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Date Picker (disable edit) */}
          <Form.Item
            name="date"
            label="วันที่"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
          >
            <DatePicker
              size={'large'}
              color='red'
              format={dateFormat}
              disabled
              disabledDate={disabledDatePicker}
            />
          </Form.Item>

          {/* Number of People */}
          <Form.Item
            name="numberOfPeople"
            label="พนักงานประจำ (จากฐานข้อมูล)"
            
          >
            <InputNumber disabled size="large" min={1} max={100000} defaultValue={3}
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

          <Form.Item
            name="workingPeople"
            label="พนักงานประจำที่เหลือ"
            
          >
            <InputNumber disabled size="large" min={1} max={100000} defaultValue={5}
              className="w-full"
            />
          </Form.Item>

            {/*ลากิจ*/}
          <Form.Item
            name="businessLeave"
            label="ลากิจ"
          >
            <InputNumber 
              size="large" min={0} max={100000} defaultValue={0} 
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

          {/*ลาป่วย*/}
          <Form.Item
            name="sickLeave"
            label="ลาป่วย"
          >
            <InputNumber 
              size="large" min={0} max={100000} defaultValue={0} 
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

           {/*ขาดงาน*/}
           <Form.Item
            name="peoleaveple"
            label="ขาดงาน"
          >
            <InputNumber 
              size="large" min={0} max={100000} defaultValue={0} 
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

          {/*พนักงานเกินสัญญา*/}
          <Form.Item
            name="overContractEmployee"
            label="พนักงานเกินสัญญา"
          >
            <InputNumber 
              size="large" min={0} max={100000} defaultValue={0} 
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

            {/*แทนงาน*/}
           <Form.Item
            name="replacementEmployee"
            label="แทนงาน"
          >
            <InputNumber 
              size="large" min={0} max={100000} defaultValue={0} 
              className="w-full"
              placeholder="กรอกจำนวนคน"
            />
          </Form.Item>

            {/*หมายเหตุ*/}
           <Form.Item
            name="remark"
            label="หมายเหตุ"
          >
            
          <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
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

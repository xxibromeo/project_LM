"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
} from "antd";
import {
  getAllTimesheets,
  updateTimesheet,
  ILMTimesheetRecords,
} from "@/app/admin/attendance/action";
import dayjs from "dayjs";

export default function TimesheetPage() {
  const [timesheets, setTimesheets] = useState<ILMTimesheetRecords[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState<ILMTimesheetRecords | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchData = async () => {
    const res = await getAllTimesheets();
    setTimesheets(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    if (editingData) {
      await updateTimesheet(editingData.id, {
        ...values,
      });
      fetchData();
      setOpenModal(false);
      setEditingData(null);
    }
  };

  console.log("timesheet", timesheets);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">จัดการข้อมูล Timesheet</h1>

      <Table
        dataSource={timesheets}
        rowKey="id"
        scroll={{ x: "max-content" }}
        columns={[
          {
            title: "วันที่",
            dataIndex: "date",
            render: (d) => dayjs(d).format("YYYY-MM-DD"),
          },
          { title: "รหัสไซต์", dataIndex: "siteCode" },
          { title: "ชื่อไซต์", dataIndex: "siteName" },
          { title: "จำนวนพนักงาน", dataIndex: "numberOfPeople" },
          { title: "ทำงาน", dataIndex: "workingPeople" },
          { title: "ลากิจ", dataIndex: "businessLeave" },
          { title: "ลาป่วย", dataIndex: "sickLeave" },
          { title: "ลาอื่นๆ", dataIndex: "peopleLeave" },
          { title: "นอกสัญญา", dataIndex: "overContractEmployee" },
          { title: "ทดแทน", dataIndex: "replacementEmployee" },
          {
            title: "แก้ไข",
            render: (_, record) => (
              <Button
                onClick={() => {
                  setEditingData(record);
                  form.setFieldsValue({ ...record, date: dayjs(record.date) });
                  setOpenModal(true);
                }}
              >
                แก้ไข
              </Button>
            ),
          },
        ]}
      />

      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingData(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title="แก้ไข Timesheet"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="วันที่" name="date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Site Code"
            name="siteCode"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="จำนวนพนักงาน"
            name="numberOfPeople"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="ทำงาน" name="workingPeople">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="ลากิจ" name="businessLeave">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="ลาป่วย" name="sickLeave">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="ลาอื่นๆ" name="peopleLeave">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="นอกสัญญา" name="overContractEmployee">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="ทดแทน" name="replacementEmployee">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="หมายเหตุ" name="remark">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="ชื่อผู้บันทึก" name="nameadmin">
            <Input />
          </Form.Item>
          <Form.Item label="รายชื่อผู้ทดแทน" name="replacementNames">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

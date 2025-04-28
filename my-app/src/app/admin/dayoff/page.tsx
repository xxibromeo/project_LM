"use client";

"use client";

import { useEffect, useState } from "react";
import { Table, Modal, Form, Input, InputNumber, Button, DatePicker, Popconfirm } from "antd";
import { getAllSiteDayOff, addSiteDayOff, updateSiteDayOff, deleteSiteDayOff } from "./action";
import dayjs from "dayjs";

type SiteDayOff = {
  id: number;
  workDate: Date;
  subSite: string;
  siteCode: string;
  siteName: string;
  typeSite: string;
  numberOfPeople: number;
  penaltyRate: number;
  dailyWorkingEmployees: number;
};

export default function SiteDayOffPage() {
  const [data, setData] = useState<SiteDayOff[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SiteDayOff | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const res = await getAllSiteDayOff();
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values: SiteDayOff) => {
    if (editingRecord) {
      await updateSiteDayOff(editingRecord.id, {
        ...values,
        workDate: values.workDate, // เพราะในฐานข้อมูลต้องเป็น Date จริง
      });
    } else {
      await addSiteDayOff({
        ...values,
        workDate: values.workDate,
      });
    }
    fetchData();
    form.resetFields();
    setEditingRecord(null);
    setOpenModal(false);
  };
  
  const handleDelete = async (id: number) => {
    await deleteSiteDayOff(id);
    fetchData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">จัดการ Site Day Off</h1>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          เพิ่มใหม่
        </Button>
      </div>

      <Table
        dataSource={data}
        rowKey="id"
        scroll={{ x: "max-content" }}
        columns={[
          { title: "วันที่ทำงาน", dataIndex: "workDate", render: (d) => dayjs(d).format("YYYY-MM-DD") },
          { title: "SubSite", dataIndex: "subSite" },
          { title: "Site Code", dataIndex: "siteCode" },
          { title: "Site Name", dataIndex: "siteName" },
          { title: "Type Site", dataIndex: "typeSite" },
          { title: "จำนวนคน", dataIndex: "numberOfPeople" },
          { title: "ค่าปรับ", dataIndex: "penaltyRate" },
          { title: "ทำงานจริง", dataIndex: "dailyWorkingEmployees" },
          {
            title: "Action",
            render: (_, record: SiteDayOff) => (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingRecord(record);
                    form.setFieldsValue({
                      ...record,
                      workDate: dayjs(record.workDate),
                    });
                    setOpenModal(true);
                  }}
                >
                  แก้ไข
                </Button>
                <Popconfirm title="ยืนยันลบ?" onConfirm={() => handleDelete(record.id)}>
                  <Button danger>ลบ</Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title={editingRecord ? "แก้ไข Site Day Off" : "เพิ่ม Site Day Off"}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="วันที่ทำงาน" name="workDate" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="SubSite" name="subSite" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Site Code" name="siteCode" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Site Name" name="siteName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Type Site" name="typeSite" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="จำนวนคน" name="numberOfPeople" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} />
          </Form.Item>
          <Form.Item label="ค่าปรับ" name="penaltyRate" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="ทำงานจริง" name="dailyWorkingEmployees" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

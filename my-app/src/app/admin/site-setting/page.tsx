"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs"; // เพิ่ม import นี้ที่หัวไฟล์ด้วย

import { Table, Modal, Form, Input, Button, DatePicker } from "antd";
import {
  getAllSites,
  addSite,
  updateSite,
} from "@/app/admin/site-setting/action";

type Site = {
  endDate: Date;
  startDate: Date;
  id: number;
  siteCode: string | null;
  siteName: string | null;
  numberOfPeople: number | null;
  clientName: string | null;
};

export default function SiteManagementPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [form] = Form.useForm();

  const fetchSites = async () => {
    const res = await getAllSites();
    setSites(res);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.toDate() : undefined,
      endDate: values.endDate ? values.endDate.toDate() : undefined,
    };

    if (!editingSite) {
      delete payload.id; // ⭐ ต้องลบ id ตอนเพิ่ม
    }

    if (editingSite) {
      await updateSite(editingSite.id, payload);
    } else {
      await addSite(payload);
    }

    fetchSites();
    form.resetFields();
    setEditingSite(null);
    setOpenModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Site Management</h1>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          เพิ่ม Site
        </Button>
      </div>

      <Table
        dataSource={sites}
        rowKey="id"
        columns={[
          { title: "Site Code", dataIndex: "siteCode" },
          { title: "Site Name", dataIndex: "siteName" },
          { title: "จำนวนคน", dataIndex: "numberOfPeople" },
          { title: "ชื่อลูกค้า", dataIndex: "clientName" },
          {
            title: "วันที่เริ่มงาน",
            dataIndex: "startDate",
            render: (date: Date) =>
              date ? dayjs(date).format("YYYY-MM-DD") : "-",
          },
          {
            title: "วันที่สิ้นสุดงาน",
            dataIndex: "endDate",
            render: (date: Date) =>
              date ? dayjs(date).format("YYYY-MM-DD") : "-",
          },
          {
            title: "Actions",
            render: (_, record: Site) => (
              <Button
                onClick={() => {
                  setEditingSite(record);
                  form.setFieldsValue({
                    ...record,
                    startDate: record.startDate
                      ? dayjs(new Date(record.startDate))
                      : null,
                    endDate: record.endDate
                      ? dayjs(new Date(record.endDate))
                      : null,
                  });

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
          setEditingSite(null);
          form.resetFields();
        }}
        title={editingSite ? "แก้ไข Site" : "เพิ่ม Site"}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            label="Client Name"
            name="clientName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="จำนวนคน"
            name="numberOfPeople"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} className="w-full" />
          </Form.Item>
          <Form.Item label="Penalty Rate" name="penaltyRate">
            <Input type="number" min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Type Site"
            name="typeSite"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Admin Wage" name="adminWage">
            <Input />
          </Form.Item>

          <Form.Item label="Site Supervisor Name" name="siteSupervisorName">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

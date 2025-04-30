"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs"; // เพิ่ม import นี้ที่หัวไฟล์ด้วย

import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Tooltip,
} from "antd";
import {
  getAllSites,
  addSite,
  updateSite,
} from "@/app/admin/site-setting/action";

type Site = {
  id: number;
  siteCode: string;
  siteName: string;
  subSite: string;
  clientName: string | null;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number | null;
  penaltyRate: number | null;
  typeSite: string | null;
  adminWage: string | null;
  siteSupervisorName: string | null;
  status: string | null;
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
      numberOfPeople: parseInt(values.numberOfPeople, 10) || 0,
      penaltyRate:
        values.penaltyRate !== undefined && values.penaltyRate !== ""
          ? parseInt(values.penaltyRate, 10)
          : null,
    };

    // ตรวจสอบว่า status ถูกส่งมาด้วย
    console.log("status:", payload.status); // ตรวจสอบค่า status

    if (!editingSite) {
      delete payload.id; // ลบ id ตอนเพิ่ม
    }

    if (editingSite) {
      await updateSite(editingSite.id, payload); // ส่งข้อมูลที่แก้ไขไป
    } else {
      await addSite(payload); // ส่งข้อมูลใหม่ไป
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
          {
            title: "subSite",
            dataIndex: "subSite",
            render: (text: string) => (
              <Tooltip title={"ให้เพิ่ม _ตามด้วยเลข _1 เช่น subsite=>66LML0011_1  = NMT - งานสวน กม.21 "}>
                <span>{text}</span>
              </Tooltip>
            ),
          },
          { title: "Site Code", dataIndex: "siteCode" },
          { title: "Site Name", dataIndex: "siteName" },
          { title: "ชื่อลูกค้า", dataIndex: "clientName" },
          { title: "พนักงานตามสัญญา", dataIndex: "numberOfPeople" },
          {
            title: "วันที่เริ่มงาน",
            dataIndex: "startDate",
            render: (date: Date) =>
              date ? dayjs(date).format("DD-MM-YYYY") : "-",
          },
          {
            title: "วันที่สิ้นสุดงาน",
            dataIndex: "endDate",
            render: (date: Date) =>
              date ? dayjs(date).format("DD-MM-YYYY") : "-",
          },
          { title: "อัตราค่าปรับ", dataIndex: "penaltyRate" },
          { title: "ประเภทการชดเชย", dataIndex: "typeSite" },
          { title: "ธุรการ(ค่าแรง)", dataIndex: "adminWage" },
          { title: "ชื่อหน.ไซด์", dataIndex: "siteSupervisorName" },
          { title: "สถานะไซต์", dataIndex: "status" },
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
            label="subSite"
            name="subSite"
            rules={[{ required: true }]}
          >
            <Input />
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
            label="พนักงานตามสัญญา"
            name="numberOfPeople"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} className="w-full" />
          </Form.Item>
          <Form.Item label="อัตราค่าปรับ" name="penaltyRate">
            <Input type="number" min={0} className="w-full" />
          </Form.Item>

          <Form.Item label="ประเภทการชดเชย" name="typeSite">
            <Select placeholder="เลือกประเภทการชดเชย">
              <Select.Option value="ชดเชยรายเดือน ">
                ชดเชยรายเดือน
              </Select.Option>
              <Select.Option value="ชดเชยรายวัน">ชดเชยรายวัน</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="ธุรการ(ค่าแรง)" name="adminWage">
            <Input />
          </Form.Item>

          <Form.Item label="ชื่อหน.ไซด์" name="siteSupervisorName">
            <Input />
          </Form.Item>

          <Form.Item label="สถานะไซต์" name="status">
            <Select placeholder="เลือกสถานะไซต์">
              <Select.Option value="active ">ยังไม่หมดอายุสัญญา</Select.Option>
              <Select.Option value="expired">หมดสัญญา</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

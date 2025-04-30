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
  Popconfirm,
  Select,
} from "antd";
import {
  getAllSiteDayOff,
  addSiteDayOff,
  updateSiteDayOff,
  deleteSiteDayOff,
} from "./action";
import dayjs from "dayjs";

type Site = {
  subSite: string;
  siteCode: string;
  siteName: string;
  typeSite: string;
  numberOfPeople: number;
  penaltyRate: number;
};


type SiteDayOff = {
  id: number;
  workDate: Date;
  subSite: string;
  siteCode: string;
  siteName: string;
  typeSite: string;
  numberOfPeople: number;
  penaltyRate: number;
  workingPeople:number|null;
};

export default function SiteDayOffPage() {
  const [data, setData] = useState<SiteDayOff[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SiteDayOff | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const res = await getAllSiteDayOff();
    setData(res);
  };

  useEffect(() => {
    fetchData();
    fetch("/api/site-list")
      .then((res) => res.json())
      .then(setSiteList);
  }, []);

  const onFinish = async (values: SiteDayOff) => {
    const payload = {
      ...values,
      workDate: values.workDate,
      numberOfPeople: Number(values.numberOfPeople),
      penaltyRate: Number(values.penaltyRate),
      workingPeople: Number(values.workingPeople),
    };

    if (editingRecord) {
      await updateSiteDayOff(editingRecord.id, payload);
    } else {
      await addSiteDayOff(payload);
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
          {
            title: "วันที่ทำงาน",
            dataIndex: "workDate",
            render: (date: Date) =>
              date ? dayjs(date).format("YYYY-MM-DD") : "-",
          },
          { title: "SubSite", dataIndex: "subSite" },
          { title: "Site Code", dataIndex: "siteCode" },
          { title: "Site Name", dataIndex: "siteName" },
          { title: "Type Site", dataIndex: "typeSite" },
          { title: "จำนวนพนักงานตามสัญญา", dataIndex: "numberOfPeople" },
          { title: "ค่าปรับ", dataIndex: "penaltyRate" },
          { title: "พนักงานประจำตามแผนส่งคนรายวัน", dataIndex: "workingPeople" },
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
                <Popconfirm
                  title="ยืนยันลบ?"
                  onConfirm={() => handleDelete(record.id)}
                >
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
          <Form.Item
            label="วันที่ทำงาน"
            name="workDate"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="เลือกชื่อไซต์"
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => {
                const selected = siteList.find((s) => s.siteName === value);
                if (selected) {
                  form.setFieldsValue({
                    subSite: selected.subSite,
                    siteCode: selected.siteCode,
                    typeSite: selected.typeSite,
                    numberOfPeople: selected.numberOfPeople,
                    penaltyRate: selected.penaltyRate,
                  });
                }
              }}
            >
              {siteList.map((site) => (
                <Select.Option key={site.siteName} value={site.siteName}>
                  {site.siteName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subSite" label="SubSite">
            <Input disabled />
          </Form.Item>
          <Form.Item name="siteCode" label="Site Code">
            <Input disabled />
          </Form.Item>
          <Form.Item name="typeSite" label="ประเภทการชดเชย">
            <Input disabled />
          </Form.Item>
          <Form.Item name="numberOfPeople" label="พนักงานตามสัญญา">
            <InputNumber className="w-full" disabled />
          </Form.Item>
          <Form.Item name="penaltyRate" label="ค่าปรับ">
            <InputNumber className="w-full" disabled />
          </Form.Item>

          <Form.Item
            label="พนักงานประจำตามแผนส่งคนรายวัน"
            name="workingPeople"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

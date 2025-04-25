"use client";

import { useEffect, useState } from "react";
import { Table, Modal, Form, Input, InputNumber, Button } from "antd";
import { getAllSites, addSite, updateSite } from "@/app/admin/site-setting/action";

type Site = {
  id: number;
  siteCode: string|null;
  siteName: string|null;
  numberOfPeople: number|null;
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
    if (editingSite) {
      await updateSite(editingSite.id, values);
    } else {
      await addSite(values);
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
          {
            title: "Actions",
            render: (_, record: Site) => (
              <Button onClick={() => {
                setEditingSite(record);
                form.setFieldsValue(record);
                setOpenModal(true);
              }}>
                แก้ไข
              </Button>
            )
          }
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
          <Form.Item label="Site Code" name="siteCode" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Site Name" name="siteName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="จำนวนคน" name="numberOfPeople" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

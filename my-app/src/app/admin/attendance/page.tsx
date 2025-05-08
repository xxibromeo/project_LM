"use client";

import { useEffect, useState } from "react";
import { Table, Modal, Form, Input, Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import {
  getAllTimesheets,
  updateTimesheet,
  ILMTimesheetRecords,
} from "@/app/admin/attendance/action";
import "dayjs/locale/th";
import { saveAs } from "file-saver";
dayjs.locale("th");
import * as XLSX from "xlsx";

export default function TimesheetPage() {
  const [timesheets, setTimesheets] = useState<ILMTimesheetRecords[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState<ILMTimesheetRecords | null>(
    null
  );
  const [replacementCount, setReplacementCount] = useState(0);
  const [form] = Form.useForm();
  const { data: session } = useSession(); // ✅ เปลี่ยนชื่อเป็น session เพื่อไม่ชนกับ data

  const exportToExcel = () => {
    const cleanedData = timesheets.map((item, index) => ({
      ลำดับ: index + 1,
      วันที่: dayjs(item.date).format("D MMMM YYYY เวลา HH:mm"),
      รหัสไซต์: item.siteCode,
      ชื่อไซต์: item.siteName,
      พนักงานตามสัญญา: item.numberOfPeople,
      พนักงานตามแผน: item.workingPeople,
      มาทำงานจริง: item.dailyWorkingEmployees,
      ลากิจ: item.businessLeave,
      ลาป่วย: item.sickLeave,
      ขาดงาน: item.peopleLeave,
      เกินสัญญา: item.overContractEmployee,
      จำนวนคนแทน: item.replacementEmployee,
      รายชื่อคนแทน: (item.replacementNames || []).join(", "),
      หมายเหตุ: item.remark,
      ผู้บันทึก: item.nameadmin || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `รายงาน-timesheet_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  const fetchData = async () => {
    const res = await getAllTimesheets();

    const sorted = res.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // เรียงตาม datetime จากมากไปน้อย
    });

    setTimesheets(sorted);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ ตั้งค่าฟอร์มเมื่อ editingData และ session พร้อมแล้ว
  useEffect(() => {
    if (!editingData || !session?.user?.name) return;

    form.setFieldsValue({
      ...editingData,
      date: dayjs(editingData.date),
      nameadmin: session.user.name,
    });
    setReplacementCount(editingData.replacementEmployee || 0);
  }, [editingData, form, session?.user?.name]);

  const onFinish = async (values: ILMTimesheetRecords) => {
    if (editingData) {
      const cleanedNames = (values.replacementNames || []).filter(
        (name: string) => name.trim() !== ""
      );

      const updatedData = {
        ...values,
        replacementNames: cleanedNames,
        replacementEmployee: cleanedNames.length,
        numberOfPeople: Number(values.numberOfPeople),
        workingPeople: Number(values.workingPeople),
        dailyWorkingEmployees: Number(values.dailyWorkingEmployees),
        businessLeave: Number(values.businessLeave),
        sickLeave: Number(values.sickLeave),
        peopleLeave: Number(values.peopleLeave),
        overContractEmployee: Number(values.overContractEmployee),
      };

      await updateTimesheet(editingData.id, updatedData);
      fetchData();
      setOpenModal(false);
      setEditingData(null);
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">จัดการข้อมูล Timesheet</h1>
      <Button
        type="primary"
        className="mb-4 bg-green-600 text-white"
        onClick={exportToExcel}
      >
        📥 ดาวน์โหลด Excel
      </Button>

      <Table
        dataSource={timesheets}
        rowKey="id"
        scroll={{ x: "max-content" }}
        columns={[
          {
            title: "วันที่",
            dataIndex: "date",
            sorter: (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
            defaultSortOrder: "descend",
            render: (d) => dayjs(d).format("YYYY-MM-DD HH:mm"),
          },
          { title: "รหัสไซต์", dataIndex: "siteCode" },
          { title: "ชื่อไซต์", dataIndex: "siteName" },
          { title: "พนักงานตามสัญญา", dataIndex: "numberOfPeople" },
          {
            title: "พนักงานประจำตามแผนส่งคนรายวัน",
            dataIndex: "workingPeople",
          },
          {
            title: "พนักงานประจำ(ที่มาทำงาน)",
            dataIndex: "dailyWorkingEmployees",
          },
          { title: "ลากิจ", dataIndex: "businessLeave" },
          { title: "ลาป่วย", dataIndex: "sickLeave" },
          { title: "ลาอื่นๆ", dataIndex: "peopleLeave" },
          { title: "พนักงานเกินสัญญา", dataIndex: "overContractEmployee" },
          { title: "แทนงาน", dataIndex: "replacementEmployee" },
          {
            title: "รายชื่อคนแทนงาน",
            dataIndex: "replacementNames",
            render: (names: string[]) =>
              (names || [])
                .filter((name) => name.trim() !== "")
                .map((name, index) => <div key={index}>• {name}</div>),
          },
          {
            title: "แก้ไข",
            render: (_, record) => (
              <Button
                onClick={() => {
                  setEditingData(record);
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
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="วันที่" name="date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Site Code" name="siteCode">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Site Name" name="siteName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="จำนวนพนักงานตามสัญญา" name="numberOfPeople">
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item label="พนักงานประจำตามแผนส่งคนรายวัน" name="workingPeople">
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item
            label="พนักงานประจำ(ที่มาทำงาน)"
            name="dailyWorkingEmployees"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="ลากิจ (พนักงานประจำ)" name="businessLeave">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="ลาป่วย (พนักงานประจำ)" name="sickLeave">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="ขาดงาน (พนักงานประจำ)" name="peopleLeave">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="พนักงานเกินสัญญา" name="overContractEmployee">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="จำนวนคนแทนงาน" name="replacementEmployee">
            <Input
              type="number"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  const current = form.getFieldValue("replacementNames") || [];
                  const added = Array.from(
                    { length: value - current.length },
                    () => ""
                  );
                  const updated = [...current, ...added];
                  form.setFieldsValue({ replacementNames: updated });
                  setReplacementCount(value);
                }
              }}
              className="w-full"
            />
          </Form.Item>

          {Array.from({ length: replacementCount }, (_, index) => (
            <Form.Item
              key={index}
              label={`ชื่อคนแทนงาน ${index + 1}`}
              required
              style={{ marginBottom: 0 }}
            >
              <div className="flex gap-2 items-start">
                <Form.Item
                  name={["replacementNames", index]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกชื่อ-สกุลคนแทนงาน",
                    },
                  ]}
                >
                  <Input
                    className="w-full"
                    placeholder="กรุณากรอกชื่อ-สกุลคนแทนงาน"
                  />
                </Form.Item>
                <Button
                  danger
                  onClick={() => {
                    const current =
                      form.getFieldValue("replacementNames") || [];
                    const updated = [...current];
                    updated.splice(index, 1);
                    form.setFieldsValue({
                      replacementNames: updated,
                      replacementEmployee: updated.length,
                    });
                    setReplacementCount(updated.length);
                  }}
                >
                  ลบ
                </Button>
              </div>
            </Form.Item>
          ))}

          <Form.Item label="หมายเหตุ" name="remark">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="ชื่อผู้บันทึก" name="nameadmin">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

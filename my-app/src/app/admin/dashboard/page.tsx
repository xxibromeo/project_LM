"use client";
import { DatePicker, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getAllTimesheets } from "@/app/admin/attendance/action";

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllTimesheets();
      const filtered = res.filter((item) =>
        dayjs(item.date).isSame(selectedDate, "day")
      );

      // สร้าง field รวมลา และรวม total
      const transformed = filtered.map((item) => ({
        ...item,
        totalLeave:
          (item.businessLeave || 0) +
          (item.sickLeave || 0) +
          (item.peopleLeave || 0),
      }));

      const totalRow = {
        key: "total",
        siteName: "รวมทั้งหมด",
        dailyWorkingEmployees: transformed.reduce((sum, i) => sum + (i.dailyWorkingEmployees || 0), 0),
        totalLeave: transformed.reduce((sum, i) => sum + (i.totalLeave || 0), 0),
        overContractEmployee: transformed.reduce((sum, i) => sum + (i.overContractEmployee || 0), 0),
        replacementEmployee: transformed.reduce((sum, i) => sum + (i.replacementEmployee || 0), 0),
      };

      setData([...transformed, totalRow]);
    };
    fetch();
  }, [selectedDate]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">รายงานประจำวัน</h1>
      <DatePicker value={selectedDate} onChange={setSelectedDate} className="mb-4" />

      <Table
        dataSource={data}
        rowKey={(record) => record.id || record.key}
        pagination={false}
        columns={[
          { title: "ชื่อไซต์", dataIndex: "siteName" },
          { title: "มาทำงาน", dataIndex: "dailyWorkingEmployees" },
          { title: "ลา/ขาดงานรวม", dataIndex: "totalLeave" },
          { title: "เกินสัญญา", dataIndex: "overContractEmployee" },
          { title: "แทนงาน", dataIndex: "replacementEmployee" },
        ]}
      />
    </div>
  );
}

"use client";

import { DatePicker, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getAllTimesheets } from "@/app/admin/attendance/action";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ILMTimesheetRecords } from "@/app/admin/attendance/action";


export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [data, setData] = useState<ILMTimesheetRecords[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllTimesheets();
      const filtered = res.filter((item) => dayjs(item.date).isSame(selectedDate, "day"));
      setData(filtered);
    };
    fetch();
  }, [selectedDate]);

  const tableData = data.map((item) => {
    const totalLeave = (item.businessLeave || 0) + (item.sickLeave || 0) + (item.peopleLeave || 0);
    return {
      key: item.id,
      siteName: item.siteName,
      numberOfPeople: item.numberOfPeople,
      working: item.dailyWorkingEmployees,
      leaveTotal: totalLeave,
      overContract: item.overContractEmployee,
      replacement: item.replacementEmployee,
    };
  });

  const summary = tableData.reduce(
    (acc, item) => {
      acc.working += item.working;
      acc.leaveTotal += item.leaveTotal;
      acc.overContract += item.overContract;
      acc.replacement += item.replacement;
      acc.numberOfPeople += item.numberOfPeople;
      return acc;
    },
    { working: 0, leaveTotal: 0, overContract: 0, replacement: 0, numberOfPeople: 0 }
  );

  const chartData = tableData.map((item) => ({
    name: item.siteName,
    มาทำงาน: item.working,
    ลา_ขาด: item.leaveTotal,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">รายงานประจำวัน</h1>
      <DatePicker value={selectedDate} onChange={setSelectedDate} className="mb-4" />

      <Table
        dataSource={[...tableData, {
          key: "summary",
          siteName: "รวมทั้งหมด",
          working: summary.working,
          leaveTotal: summary.leaveTotal,
          overContract: summary.overContract,
          replacement: summary.replacement,
          numberOfPeople: summary.numberOfPeople,
        }]}
        pagination={false}
        columns={[
          { title: "ชื่อไซต์", dataIndex: "siteName" },
          { title: "ตามสัญญา", dataIndex: "numberOfPeople" },
          { title: "มาทำงาน", dataIndex: "working" },
          { title: "ลา/ขาดงานรวม", dataIndex: "leaveTotal" },
          { title: "เกินสัญญา", dataIndex: "overContract" },
          { title: "แทนงาน", dataIndex: "replacement" },
        ]}
      />

      <div className="text-md font-medium mt-6">
        วันนี้มีพนักงานประจำที่มาทำงานทั้งหมด {summary.working} คน จากพนักงานตามสัญญา {summary.numberOfPeople} คน
        โดยมีพนักงานลา/ขาดงานรวม {summary.leaveTotal} คน พนักงานเกินสัญญา {summary.overContract} คน
        และมีการแทนงาน {summary.replacement} คน
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="มาทำงาน" fill="#4caf50" />
            <Bar dataKey="ลา_ขาด" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

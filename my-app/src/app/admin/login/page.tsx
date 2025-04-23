"use client";

import { signIn } from "next-auth/react";
import { Button, Card } from "antd";
import { WindowsOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function AdminLoginPage() {
  return (
    <div
      className="flex items-center justify-center h-screen w-screen bg-white bg-cover bg-center"
      style={{ backgroundImage: `url('/bg_login.jpg')` }}
    >
      <div className="m-auto">
        <div className=" p-16 rounded-xl text-black">
          <Card className="w-96 shadow-xl rounded-xl text-center">
            <div className="flex justify-center my-3">
              <Image
                src="/logo-SO.webp"
                alt="logo-so"
                width={100}
                height={100}
              />
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              ยินดีต้อนรับสู่ระบบจัดการการลงเวลา LM
            </h2>
            <p className="text-gray-500 mb-6">กดเข้าสู่ระบบเพื่อใช้งาน</p>
            <Button
              type="primary"
              size="large"
              className="w-full flex items-center justify-center gap-2"
              onClick={() =>
                signIn("azure-ad", { callbackUrl: "/admin/attendance" })
              }
            >
              <WindowsOutlined />
              เข้าสู่ระบบด้วยบัญชีองค์กร
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

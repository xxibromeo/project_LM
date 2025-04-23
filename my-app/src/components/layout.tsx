"use client";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
 
const { Header, Sider, Content } = Layout;
 
export const menuItems = [
  {
    key: "dashboard",
    label: "แดชบอร์ด",
    icon: <DashboardOutlined />,
    path: "/admin/dashboard",
  },
  
  {
    key: "attendance",
    label: "Time Attendance",
    icon: <FieldTimeOutlined />,
    path: "/admin/attendance",
  },
  {
    key: "site-setting",
    label: "ตั้งค่า Site",
    icon: <SettingOutlined />,
    path: "/admin/site-setting",
  },
];
 
export default function SharedLayout({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSession();
 
  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };
 
  const userMenu = (
    <Menu>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );
 
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider theme="light" collapsible>
        <div className="flex flex-col items-center">
          <Image
            src="/logo-SO.webp"
            width={100}
            height={100}
            alt="Logo"
            className="w-12 my-4"
          />
          <div className="logo text-gray-600 py-2 text-sm font-bold">
            สยามราชธานี จำกัด มหาชน
          </div>
        </div>
 
        <Menu
          theme="light"
          mode="vertical"
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
          items={menuItems.map((item) => ({
            key: item.path,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </Sider>
 
      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Header
          style={{ padding: 0, background: "#fff" }}
          className="px-4 shadow flex justify-end items-center"
        >
          {/* User Avatar Dropdown */}
          <Dropdown overlay={userMenu} trigger={["hover"]} className="mr-5">
            <Space className="cursor-pointer">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={data?.user?.image}
              />
              <span className="font-medium">
                {data?.user?.name ?? "unknown"}
              </span>
            </Space>
          </Dropdown>
        </Header>
 
        {/* Content */}
        <Content className="m-4 p-6 bg-white shadow rounded-lg">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  TableOutlined,
  InboxOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="h-screen">
      <div className="logo p-4 text-center text-white text-lg font-bold">
        {collapsed ? "A" : "Admin"}
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<FileTextOutlined />}>
          <Link to="/admin/products">Products</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<TableOutlined />}>
          <Link to="/tables">Tables</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<InboxOutlined />}>
          <Link to="/forms">Forms</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<AppstoreOutlined />}>
          <Link to="/tabs">Tabbed Content</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<CalendarOutlined />}>
          <Link to="/calendar">Calendar</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<ArrowUpOutlined />} className="mt-auto">
          <Link to="/upgrade">Upgrade to Pro!</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSidebar;
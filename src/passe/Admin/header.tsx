import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Menu, Input, Space } from "antd";
import { UserOutlined, BellOutlined, SearchOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AdminHeader: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <a href="#">Profile</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="#">Settings</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="#">Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-white px-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="text-lg font-bold text-blue-600">Admin Panel</div>

      {/* Avatar & Notifications */}
      <Space>
        <BellOutlined className="text-xl cursor-pointer" />
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar size="large" icon={<UserOutlined />} className="cursor-pointer" />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AdminHeader from "../Admin/header";
import SideBar from "../Admin/sideBar";

const { Content } = Layout;

export default function LayoutAdmin() {
  return (
    <Layout style={{ height: "100vh" }}>
      <SideBar />
      <Layout>
        <AdminHeader />
        <Content style={{ margin: "16px", padding: "16px", background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

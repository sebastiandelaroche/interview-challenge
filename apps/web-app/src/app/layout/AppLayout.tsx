import { Layout, Typography } from "antd";
import { Link, Outlet } from "react-router";

export function AppLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
            Tickets
          </Typography.Title>
        </Link>
      </Layout.Header>
      <Layout.Content
        style={{ padding: 24, maxWidth: 1200, width: "100%", margin: "0 auto" }}
      >
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

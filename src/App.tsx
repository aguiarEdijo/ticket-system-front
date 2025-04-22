import React from "react";
import { TicketForm } from "./features/tickets/ticketForm";
import { TicketList } from "./features/tickets/ticketList";
import { Layout, Typography, Space, Divider, ConfigProvider } from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;


const theme = {
  token: {
    colorPrimary: "#4361ee",
    colorLink: "#4361ee",
    colorTextBase: "#2b2d42",
    colorTextSecondary: "#6c757d",
    colorBorder: "#e9ecef",
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`}
      </style>

      <Layout style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}>
        <Content style={{
          padding: "24px 48px",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
        }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Header style={{
              background: "transparent",
              padding: 0,
              marginBottom: 8,
            }}>
              <Title style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                marginBottom: 0,
              }}>Ticket System</Title>
              <Text type="secondary" style={{ fontSize: "1.1rem" }}>
                Manage your tickets efficiently and effectively
              </Text>
            </Header>

            <Divider style={{ margin: "16px 0" }} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(300px, 2fr) 2fr",
              gap: 16,
              alignItems: "flex-start",
            }}>
              <div style={{ position: "sticky", top: 24 }}>
                <TicketForm />
              </div>

              <div>
                <TicketList />
              </div>
            </div>
          </Space>
        </Content>

        <Footer style={{
          textAlign: "center",
          padding: "24px 50px",
          backgroundColor: "#ffffff",
          boxShadow: "0 -1px 3px rgba(0,0,0,0.1)",
        }}>
          <Text type="secondary">
            © {new Date().getFullYear()} Ticket System. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
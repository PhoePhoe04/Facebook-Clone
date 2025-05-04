import React, { useState } from "react";
import UserManagement from "./UserManagementPage";
import TextPostManagement from "./PostManagementPage";
import StatisticPage from "./StatisticPage";
import HomeDashboard from "./HomeDashBoard";
import InteractionManagementPage from "./InteractionManagementPage";

const AdminDashboard: React.FC = () => {
  const [activeContent, setActiveContent] = useState<string>("Home");

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h1 style={styles.sidebarHeader}>Admin Dashboard</h1>
        <ul style={styles.menuList}>
          <li
            style={styles.menuItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItemHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItem.backgroundColor)
            }
            onClick={() => setActiveContent("Home")}
          >
            Home
          </li>
          <li
            style={styles.menuItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItemHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItem.backgroundColor)
            }
            onClick={() => setActiveContent("Quản lý người dùng")}
          >
            Quản lý người dùng
          </li>
          <li
            style={styles.menuItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItemHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItem.backgroundColor)
            }
            onClick={() => setActiveContent("Quản lý bài đăng")}
          >
            Quản lý bài đăng
          </li>
          <li
            style={styles.menuItem}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItemHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.menuItem.backgroundColor)
            }
            onClick={() => setActiveContent("Thống kê")}
          >
            Thống kê
          </li>
        </ul>
      </aside>

      {/* Nội dung chính */}
      <main style={styles.mainContent}>
        {activeContent === "Home" && <HomeDashboard />}
        {activeContent === "Quản lý người dùng" && <UserManagement />}
        {activeContent === "Quản lý bài đăng" && <TextPostManagement />}
        {activeContent === "Quản lý tương tác" && <InteractionManagementPage />}
        {activeContent === "Thống kê" && <StatisticPage />}
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#F5ECE0", // Màu nền chính
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#34495e", // Màu tối cho sidebar
    color: "#ffffff", // Chữ màu sáng
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #2c3e50", // Viền phải sidebar
    position: "fixed", // Sidebar luôn cố định
    top: 0, // Căn phía trên
    bottom: 0, // Kéo dài đến hết chiều cao màn hình
    left: 0, // Căn phía bên trái
    overflowY: "auto", // Thêm cuộn dọc khi nội dung vượt quá chiều cao
  },
  sidebarHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: "10px 15px",
    marginBottom: "10px",
    backgroundColor: "#2c3e50", // Màu nền cho mục
    color: "#ffffff", // Màu chữ
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  menuItemHover: {
    backgroundColor: "#1abc9c", // Màu khi hover vào mục
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    marginLeft: "250px", // Đẩy nội dung chính sang phải bằng đúng chiều rộng sidebar
    backgroundColor: "#ffffff", // Màu nền sáng cho nội dung
  },
  statisticsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#ecf0f1", // Màu nền card
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  statTitle: {
    fontSize: "16px",
    color: "#34495e",
    marginBottom: "10px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
};

export default AdminDashboard;
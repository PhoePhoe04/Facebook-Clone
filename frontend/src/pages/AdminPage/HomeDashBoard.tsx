import React from "react";

const HomeDashBoard: React.FC = () => {
  return (
    <div style={styles.homeContainer}>
      {/* Thống kê tổng quan */}
      <div style={styles.statisticsSection}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Người dùng</h3>
          <p style={styles.statValue}>23,586</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Bài đăng</h3>
          <p style={styles.statValue}>12,450</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Videos</h3>
          <p style={styles.statValue}>5,789</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Doanh thu</h3>
          <p style={styles.statValue}>$15,890</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Người dùng hoạt động hàng ngày</h3>
          <p style={styles.statValue}>17,890</p>
        </div>
      </div>

      {/* Placeholder Biểu đồ */}
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Biểu đồ Tổng Quan</h3>
        <div style={styles.chartPlaceholder}>
          <p>Biểu đồ (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
  },
  statisticsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#ecf0f1",
    padding: "15px",
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
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
    color: "#2c3e50",
  },
  chartSection: {
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#34495e",
    marginBottom: "10px",
  },
  chartPlaceholder: {
    backgroundColor: "#ecf0f1",
    height: "200px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#7f8c8d",
    fontStyle: "italic",
  },
};

export default HomeDashBoard;
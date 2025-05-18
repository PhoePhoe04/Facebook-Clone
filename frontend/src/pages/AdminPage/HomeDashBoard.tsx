import axios from "axios";
import React, { useEffect, useState } from "react";

const HomeDashBoard: React.FC = () => {
  const [userCount, setUserCount] = useState<number>();
  const [postCount, setPostCount] = useState<number>();

  const getCountPost = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts/count-post");
      setPostCount(response.data);
    } catch(error) {
      console.log(error);
    }
  };

  const getCountUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/count-user");
      setUserCount(response.data);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Gọi cả hai hàm bất đồng bộ
    const fetchCounts = async () => {
      await Promise.all([getCountPost(), getCountUser()]);
    };

    fetchCounts();
  }, []);

  return (
    <div style={styles.homeContainer}>
      {/* Thống kê tổng quan */}
      <div style={styles.statisticsSection}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Người dùng</h3>
          <p style={styles.statValue}>{userCount}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Bài đăng</h3>
          <p style={styles.statValue}>{postCount}</p>
        </div>
      </div>

      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Ảnh Tổng Quan</h3>
        <img
          src="/images/homeImage.jpg" 
          style={styles.homeImage}
        />
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
  homeImage: {
    width: "100%", // Responsive: ảnh chiếm toàn bộ chiều rộng container
    maxHeight: "300px", // Giới hạn chiều cao để tránh ảnh quá lớn
    objectFit: "cover", // Đảm bảo ảnh không bị méo
    borderRadius: "8px", // Bo góc cho đẹp (tùy chọn)
  },
};

export default HomeDashBoard;
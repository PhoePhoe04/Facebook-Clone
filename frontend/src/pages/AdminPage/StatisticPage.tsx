import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticPage: React.FC = () => {
  const [statType, setStatType] = useState<string>("users");
  const [timeRange, setTimeRange] = useState<string>("week");

  // Mock dữ liệu cho biểu đồ
  const data = {
    users: {
      week: [200, 220, 230, 250, 270, 300, 320],
      month: [1000, 1200, 1300, 1500],
      year: [12000, 15000, 18000],
    },
    revenue: {
      week: [400, 450, 480, 500, 520, 550, 600],
      month: [1500, 2000, 2500, 3000],
      year: [20000, 25000, 30000],
    },
    posts: {
      week: [50, 60, 70, 80, 90, 100, 110],
      month: [200, 250, 300, 350],
      year: [4000, 4500, 5000],
    },
  };

  const labels = {
    week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    month: ["Week 1", "Week 2", "Week 3", "Week 4"],
    year: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  };

  const chartData = {
    labels: labels[timeRange],
    datasets: [
      {
        label: statType === "users" ? "Số người dùng" : statType === "revenue" ? "Doanh thu" : "Số bài viết",
        data: data[statType][timeRange],
        borderColor: statType === "users" ? "#4caf50" : statType === "revenue" ? "#2196f3" : "#ff9800",
        backgroundColor: statType === "users" ? "#a5d6a7" : statType === "revenue" ? "#90caf9" : "#ffcc80",
        fill: true,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h1 style={styles.title}>Thống Kê Biểu Đồ</h1>
      </div>
      {/* Chọn loại thống kê */}
      <div style={styles.controls}>
        <label style={styles.label}>
          Loại thống kê:
          <select value={statType} onChange={(e) => setStatType(e.target.value)} style={styles.select}>
            <option value="users">Người dùng</option>
            <option value="revenue">Doanh thu</option>
            <option value="posts">Bài viết</option>
          </select>
        </label>
        <label style={styles.label}>
          Khoảng thời gian:
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={styles.select}>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </label>
      </div>
      {/* Biểu đồ */}
      <div style={styles.chart}>
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        {/* Bạn có thể thay `Line` bằng `Bar` để hiển thị biểu đồ dạng cột */}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    backgroundColor: "#ffffff",
    fontFamily: "'Arial', sans-serif",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  panel: {
    backgroundColor: "#f5f5f5",
    padding: "10px 20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  panelTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "20px",
  },
  label: {
    fontSize: "16px",
    color: "#34495e",
  },
  select: {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  chart: {
    marginTop: "20px",
  },
};

export default StatisticPage;
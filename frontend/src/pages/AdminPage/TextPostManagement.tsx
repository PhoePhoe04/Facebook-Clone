import React, { useState } from "react";

// Dữ liệu mẫu người dùng
const usersData = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", role: "Admin" },
  { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", role: "Editor" },
  { id: 3, name: "Phạm Văn C", email: "phamvanc@gmail.com", role: "Contributor" },
  { id: 4, name: "Lê Thị D", email: "lethid@gmail.com", role: "Editor" },
  { id: 5, name: "Hoàng Văn E", email: "hoangvane@gmail.com", role: "Admin" },
];

// Dữ liệu mẫu bài viết
const initialPosts = [
  { id: 1, title: "Hướng dẫn học React", author: "Nguyễn Văn A", date: "03/10/2025", time: "08:00 AM", status: "Đã xuất bản" },
  { id: 2, title: "10 mẹo JavaScript hữu ích", author: "Trần Thị B", date: "03/15/2025", time: "10:30 AM", status: "Nháp" },
  { id: 3, title: "Lập trình TypeScript cơ bản", author: "Phạm Văn C", date: "03/20/2025", time: "02:00 PM", status: "Đang chờ duyệt" },
  { id: 4, title: "Khám phá React Hooks", author: "Nguyễn Văn A", date: "03/25/2025", time: "09:30 AM", status: "Đã xuất bản" },
];

const TextPostManagement: React.FC = () => {
  const [users] = useState(usersData); // Danh sách người dùng
  const [posts] = useState(initialPosts); // Danh sách bài viết
  const [selectedUser, setSelectedUser] = useState(""); // Người dùng được chọn
  const [searchTermUser, setSearchTermUser] = useState(""); // Tìm kiếm người dùng
  const [filterRole, setFilterRole] = useState(""); // Bộ lọc vai trò
  const [searchTermPost, setSearchTermPost] = useState(""); // Tìm kiếm bài viết
  const [filterStatus, setFilterStatus] = useState(""); // Bộ lọc trạng thái bài viết
  const [currentPageUser, setCurrentPageUser] = useState(1); // Trang hiện tại người dùng
  const [currentPagePost, setCurrentPagePost] = useState(1); // Trang hiện tại bài viết
  const usersPerPage = 5; // Số người dùng mỗi trang
  const postsPerPage = 5; // Số bài viết mỗi trang

  // Lọc người dùng
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTermUser.toLowerCase()) &&
      (filterRole ? user.role === filterRole : true)
  );

  // Tính toán danh sách người dùng cho trang hiện tại
  const indexOfLastUser = currentPageUser * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPagesUser = Math.ceil(filteredUsers.length / usersPerPage);

  // Lọc bài viết
  const filteredPosts = posts.filter(
    (post) =>
      (!selectedUser || post.author === selectedUser) &&
      post.title.toLowerCase().includes(searchTermPost.toLowerCase()) &&
      (filterStatus ? post.status === filterStatus : true)
  );

  // Tính toán danh sách bài viết cho trang hiện tại
  const indexOfLastPost = currentPagePost * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPagesPost = Math.ceil(filteredPosts.length / postsPerPage);

  // Hàm chuyển trang
  const handlePageChangeUser = (page: number) => {
    if (page >= 1 && page <= totalPagesUser) setCurrentPageUser(page);
  };
  const handlePageChangePost = (page: number) => {
    if (page >= 1 && page <= totalPagesPost) setCurrentPagePost(page);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quản lý bài đăng văn bản</h2>

      {/* Bộ lọc và tìm kiếm người dùng */}
      <div style={styles.userManagement}>
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTermUser}
          onChange={(e) => setSearchTermUser(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">-- Tất cả vai trò --</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Contributor">Contributor</option>
        </select>
      </div>

      {/* Danh sách người dùng */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Tên người dùng</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.id}
              style={{
                ...styles.tableRow,
                backgroundColor: user.name === selectedUser ? "#d3f9d8" : "#fff",
              }}
              onClick={() => {
                setSelectedUser(user.name);
                setCurrentPagePost(1); // Reset trang bài viết
              }}
            >
              <td style={styles.tableCell}>{user.name}</td>
              <td style={styles.tableCell}>{user.email}</td>
              <td style={styles.tableCell}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang người dùng */}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChangeUser(currentPageUser - 1)}
          disabled={currentPageUser === 1}
          style={{
            ...styles.pageButton,
            ...(currentPageUser === 1 ? styles.disabledButton : {}),
          }}
        >
          Trước
        </button>
        {Array.from({ length: totalPagesUser }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChangeUser(index + 1)}
            style={{
              ...styles.pageButton,
              ...(currentPageUser === index + 1 ? styles.activePageButton : {}),
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChangeUser(currentPageUser + 1)}
          disabled={currentPageUser === totalPagesUser}
          style={{
            ...styles.pageButton,
            ...(currentPageUser === totalPagesUser ? styles.disabledButton : {}),
          }}
        >
          Tiếp
        </button>
      </div>

      {/* Bộ lọc và tìm kiếm bài viết */}
      <div style={styles.postManagement}>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchTermPost}
          onChange={(e) => setSearchTermPost(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="Đã xuất bản">Đã xuất bản</option>
          <option value="Nháp">Nháp</option>
          <option value="Đang chờ duyệt">Đang chờ duyệt</option>
        </select>
      </div>

      {/* Danh sách bài viết */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Ngày</th>
            <th style={styles.tableHeader}>Tiêu đề</th>
            <th style={styles.tableHeader}>Tác giả</th>
            <th style={styles.tableHeader}>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id} style={styles.tableRow}>
            <td style={styles.tableCell}>{post.date}</td>
            <td style={styles.tableCell}>{post.title}</td>
            <td style={styles.tableCell}>{post.author}</td>
            <td style={styles.tableCell}>{post.time}</td>
          </tr>
          ))}
          {currentPosts.length === 0 && (
            <tr>
              <td colSpan={4} style={styles.emptyMessage}>
                Không có bài viết nào được tìm thấy.
              </td>
            </tr>
          )}
          </tbody>
          </table>
          
          {/* Phân trang bài viết */}
          <div style={styles.pagination}>
            <button
              onClick={() => handlePageChangePost(currentPagePost - 1)}
              disabled={currentPagePost === 1}
              style={{
                ...styles.pageButton,
                ...(currentPagePost === 1 ? styles.disabledButton : {}),
              }}
            >
              Trước
            </button>
            {Array.from({ length: totalPagesPost }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChangePost(index + 1)}
                style={{
                  ...styles.pageButton,
                  ...(currentPagePost === index + 1 ? styles.activePageButton : {}),
                }}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChangePost(currentPagePost + 1)}
              disabled={currentPagePost === totalPagesPost}
              style={{
                ...styles.pageButton,
                ...(currentPagePost === totalPagesPost ? styles.disabledButton : {}),
              }}
            >
              Tiếp
            </button>
          </div>
          </div>
);
};

// Kiểu dáng giao diện hoàn chỉnh
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  userManagement: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  filterSelect: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "14px",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: "14px",
    color: "#777",
    padding: "10px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    marginTop: "10px",
  },
  pageButton: {
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  activePageButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    color: "#777",
    cursor: "not-allowed",
  },
};

export default TextPostManagement;
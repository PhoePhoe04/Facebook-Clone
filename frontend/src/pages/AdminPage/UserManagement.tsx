import React, { useState } from "react";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "vanA@gmail.com", status: "Active" },
    { id: 2, name: "Trần Thị B", email: "thiB@gmail.com", status: "Active" },
    { id: 3, name: "Phạm Văn C", email: "vanC@gmail.com", status: "Locked" },
  ]);

  const addUser = () => {
    const newUser = {
      id: users.length + 1,
      name: "Người dùng mới",
      email: "newuser@gmail.com",
      status: "Active",
    };
    setUsers([...users, newUser]);
  };

  const editUser = (id: number) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, name: "Đã sửa tên" } : user
    );
    setUsers(updatedUsers);
  };

  const deleteUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const lockUser = (id: number) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status: "Locked" } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <div>
      {/* Panel title */}
      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Quản lý người dùng</h2>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={addUser}>Thêm người dùng</button>
      </div>

      {/* User table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Tên</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Trạng thái</th>
            <th style={styles.tableHeader}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.tableCell}>{user.id}</td>
              <td style={styles.tableCell}>{user.name}</td>
              <td style={styles.tableCell}>{user.email}</td>
              <td style={styles.tableCell}>{user.status}</td>
              <td style={styles.tableCell}>
                <button style={styles.actionButton} onClick={() => editUser(user.id)}>Sửa</button>
                <button style={styles.actionButton} onClick={() => deleteUser(user.id)}>Xóa</button>
                <button style={styles.actionButton} onClick={() => lockUser(user.id)}>Khóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  buttonContainer: {
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  table: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderCollapse: "collapse",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "left",
    padding: "10px",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
  },
  actionButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
};

export default UserManagement;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", `${firstName} ${lastName}`);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("status", "ACTIVE"); // hoặc lấy từ UI nếu có

      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        const error = await response.text();
        alert("Đăng ký thất bại: " + error);
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert("Đã xảy ra lỗi khi đăng ký.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-5xl font-bold text-blue-600 mb-4">facebook</h1>
        <h2 className="text-xl font-semibold">Tạo tài khoản mới</h2>
        <p className="text-gray-600 text-sm mb-4">Nhanh chóng và dễ dàng.</p>

        <div className="w-full">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Họ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Tên"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Số di động hoặc email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <p className="text-xs text-gray-600 mb-4">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Facebook.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Tìm hiểu thêm.
            </a>
          </p>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
          >
            Đăng ký
          </button>
          <div className="text-center mt-4">
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Bạn đã có tài khoản ư?
            </a>
          </div>
        </div>
      </form>
      <div className="w-full text-center py-6 text-gray-600 text-sm mt-8">
        <p>
          <a href="#" className="hover:underline">
            Tiếng Việt
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:underline">
            English
          </a>{" "}
          ·
          <a href="#" className="hover:underline">
            Français
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:underline">
            Español
          </a>
        </p>
        <p className="mt-2">Meta © 2025</p>
      </div>
    </div>
  );
};

export default RegisterPage;

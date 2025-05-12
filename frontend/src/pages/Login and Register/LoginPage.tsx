import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // đúng kiểu cho @RequestParam
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/");
      } else {
        alert("Email hoặc mật khẩu không đúng");
      }
      
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Container chứa logo và form đăng nhập */}
      <div className="flex flex-row items-center justify-center gap-16">
        {/* Logo và mô tả */}
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-blue-600">facebook</h1>
          <p className="text-lg text-gray-600">
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </p>
        </div>

        {/* Form đăng nhập */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700" onClick={handleLogin}>
            Đăng nhập
          </button>
          <div className="text-center mt-4">
            <a href="#" className="text-blue-600 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <hr className="my-4" />
          <button 
            onClick={() => navigate("/register")} 
            className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600">
            Tạo tài khoản mới
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full absolute bottom-0 text-center py-6 text-gray-600 text-sm">
        <p>
          <a href="#" className="hover:underline">Tiếng Việt</a> · <a href="#" className="hover:underline">English</a> ·
          <a href="#" className="hover:underline">Français</a> · <a href="#" className="hover:underline">Español</a>
        </p>
        <p className="mt-2">
          Meta © 2025
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

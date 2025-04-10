import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Container chứa logo và form đăng ký */}
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo */}
        <h1 className="text-5xl font-bold text-blue-600 mb-4">facebook</h1>
        <h2 className="text-xl font-semibold">Tạo tài khoản mới</h2>
        <p className="text-gray-600 text-sm mb-4">Nhanh chóng và dễ dàng.</p>

        {/* Form đăng ký */}
        <div className="w-full">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Họ"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tên"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Số di động hoặc email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label className="text-gray-600 text-sm">Ngày sinh</label>
            <div className="flex gap-2 mt-1">
            <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </select>

              <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1">Tháng 1</option>
                <option value="2">Tháng 2</option>
                <option value="3">Tháng 3</option>
                <option value="4">Tháng 4</option>
                <option value="5">Tháng 5</option>
                <option value="6">Tháng 6</option>
                <option value="7">Tháng 7</option>
                <option value="8">Tháng 8</option>
                <option value="9">Tháng 9</option>
                <option value="10">Tháng 10</option>
                <option value="11">Tháng 11</option>
                <option value="12">Tháng 12</option>
              </select>

              <select className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
                <option value="2012">2012</option>
                <option value="2011">2011</option>
                <option value="2010">2010</option>
                <option value="2009">2009</option>
                <option value="2008">2008</option>
                <option value="2007">2007</option>
                <option value="2006">2006</option>
                <option value="2005">2005</option>
                <option value="2004">2004</option>
                <option value="2003">2003</option>
                <option value="2002">2002</option>
                <option value="2001">2001</option>
                <option value="2000">2000</option>
                <option value="1999">1999</option>
                <option value="1998">1998</option>
                <option value="1997">1997</option>
                <option value="1996">1996</option>
                <option value="1995">1995</option>
                <option value="1994">1994</option>
                <option value="1993">1993</option>
                <option value="1992">1992</option>
                <option value="1991">1991</option>
                <option value="1990">1990</option>
                <option value="1989">1989</option>
                <option value="1988">1988</option>
                <option value="1987">1987</option>
                <option value="1986">1986</option>
                <option value="1985">1985</option>
                <option value="1984">1984</option>
                <option value="1983">1983</option>
                <option value="1982">1982</option>
                <option value="1981">1981</option>
                <option value="1980">1980</option>
                <option value="1979">1979</option>
                <option value="1978">1978</option>
                <option value="1977">1977</option>
                <option value="1976">1976</option>
                <option value="1975">1975</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-gray-600 text-sm">Giới tính</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input type="checkbox" name="gender" value="female" className="w-4 h-4" /> Nữ
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input type="checkbox" name="gender" value="male" className="w-4 h-4" /> Nam
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input type="checkbox" name="gender" value="custom" className="w-4 h-4" /> Tùy chỉnh
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Facebook. <a href="#" className="text-blue-600 hover:underline">Tìm hiểu thêm.</a>
          </p>
          <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600">
            Đăng ký
          </button>
          <div className="text-center mt-4">
            <a href="#" className="text-blue-600 hover:underline"  onClick={() => navigate("/login")} >
              Bạn đã có tài khoản ư?
            </a>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="w-full text-center py-6 text-gray-600 text-sm mt-8">
        <p>
          <a href="#" className="hover:underline">Tiếng Việt</a> · <a href="#" className="hover:underline">English</a> ·
          <a href="#" className="hover:underline">Français</a> · <a href="#" className="hover:underline">Español</a>
        </p>
        <p className="mt-2">Meta © 2025</p>
      </div>
    </div>
  );
};

export default RegisterPage;
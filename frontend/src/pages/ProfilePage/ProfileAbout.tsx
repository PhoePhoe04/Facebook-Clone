const ProfileAbout = () => {
  return (
    <div className="w-3/5 flex flex-col bg-white p-4 rounded-lg shadow-md mt-3 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Giới thiệu</h2>

      {/* Tổng quan */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng quan</h3>
          <button className="text-blue-600 hover:underline text-sm">Chỉnh sửa</button>
        </div>
        <ul className="list-none p-0">
          <li className="mb-2 text-gray-800">
            <span role="img" aria-label="education" className="mr-2">🎓</span>
            Học tại Trường Đại học Sài Gòn <br />
            Đã bắt đầu vào 2022
          </li>
          <li className="mb-2 text-gray-800">
            <span role="img" aria-label="home" className="mr-2">🏠</span>
            Sống tại Hàm Tân
          </li>
          <li className="mb-2 text-gray-800">
            <span role="img" aria-label="location" className="mr-2">📍</span>
            Đến từ Lagi, Thuận Hải, Vietnam
          </li>
        </ul>
      </div>

      {/* Liên hệ và cơ bản */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Thông tin liên hệ và cơ bản</h3>
          <button className="text-blue-600 hover:underline text-sm">Chỉnh sửa</button>
        </div>
        <ul className="list-none p-0">
          <li className="mb-2 text-gray-800">
            <span role="img" aria-label="phone" className="mr-2">📞</span>
            034 572 6227 <br />
            Di động
          </li>
        </ul>
      </div>

      {/* Công việc và học vấn */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Công việc và học vấn</h3>
          <button className="text-blue-600 hover:underline text-sm">+ Thêm</button>
        </div>
        <p className="text-gray-500 italic">Chưa có thông tin</p>
      </div>

      {/* Nơi từng sống */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Nơi từng sống</h3>
          <button className="text-blue-600 hover:underline text-sm">+ Thêm</button>
        </div>
        <p className="text-gray-500 italic">Không có nơi nào để hiển thị</p>
      </div>
    </div>
  );
};

export default ProfileAbout;

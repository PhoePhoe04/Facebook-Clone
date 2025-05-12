import { useState, useEffect } from "react";
import ProfileTabs from './ProfileTabs';
import ProfilePost from './ProfilePost';
import ProfileFriend from "./ProfileFriend";
import ProfilePhoto from "./ProfilePhoto";
import PostModal from "./PostModal";
import axios from 'axios';

const images = Array(10).fill(null).map((_, i) => `/images/dp${(i % 4) + 1}.png`);
const friends = Array(10).fill(null).map((_, i) => ({
  name: `Friend ${i + 1}`,
  img: `/images/dp${(i % 4) + 1}.png`
}));

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [activeMain, setActiveMain] = useState("Bài viết");
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      // Có thể upload sau nếu muốn
    }
  };
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = (postData: any) => {
    console.log("Bài viết mới:", postData);
  };
  if (!user) {
    return <div>Đang tải dữ liệu người dùng...</div>;
  }
  
  return (
    <div className="flex flex-col py-2 min-h-screen bg-white-fff">
      {/* Header */}
      <div className="header w-full flex">
        {/* Phần bên trái (trống) */}
        <div className="w-1/5"></div>

        {/* Phần chính giữa (Center Side) */}
        <div className="w-3/5 bg-white rounded-lg">
          <div className="flex flex-col">
            {/* Phần ảnh bìa và ảnh đại diện */}
            <div className="relative">
              {/* Ảnh bìa */}
              <img src={coverPreview || "/images/dp5.png"} alt="Cover" className="w-full h-72 object-cover" />
              {/* Nút chỉnh sửa ảnh bìa */}
              <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-md flex items-center gap-2 shadow-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                </svg>
                Chỉnh sửa ảnh bìa
              </button>
              {/* Input để chọn ảnh bìa mới */}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="absolute top-4 right-4 opacity-0 w-16 h-16"
              />
              {/* Ảnh đại diện */}
              <div className="absolute -bottom-16 left-4">
                <img src={user.avatarImage || "/images/dp5.png" } alt="Avatar" className="w-48 h-48 rounded-full border-4 border-gray-900 object-cover" />
              </div>
            </div>
            {/* Phần thông tin người dùng */}
            <div className="mt-20 px-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-400">{user.postsCount} người bạn</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-md hover:bg-blue-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Nhắn tin
                  </button>
                  <button className="bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 shadow-md hover:bg-gray-100 transition"
                    onClick={() => setIsEditFormOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Chỉnh sửa trang cá nhân
                  </button>
                </div>
              </div>
              {/* Tabs điều hướng */}
              <ProfileTabs setActiveMain={setActiveMain} activeMain={activeMain} />
            </div>
          </div>
        </div>

        {/* Phần bên phải (trống) */}
        <div className="w-1/5"></div>
      </div>
      <div className="main w-full flex mt-4">
        {/* Phần bên trái (trống) */}
        <div className="w-1/5"></div>
        {/* Nếu chọn "Bạn bè" thì chỉ hiển thị ProfileFriend, ẩn phần main */}
        {activeMain === "Bạn bè" ? (
          <ProfileFriend />
        ) : activeMain === "Ảnh" ? ( // ✅ Hiển thị ProfilePhoto khi nhấn "Ảnh"
          <ProfilePhoto />
        ) : (
          <div className="w-3/5 flex flex-row py-2 min-h-screen">
            <div className="w-2/5 p-4 rounded-lg shadow-md">
              {/* Ảnh */}
              <div className="mb-4 border rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Ảnh</h2>
                  <button onClick={() => setActiveMain("Ảnh")} className="text-blue-500 hover:underline">
                    Xem tất cả ảnh
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.slice(0, 9).map((img, index) => (
                    <img key={index} src={img} className="w-full h-40 object-cover rounded-md" />
                  ))}
                </div>
              </div>

              {/* Bạn bè */}
              <div className="mb-4 border rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Bạn bè</h2>
                  <button onClick={() => setActiveMain("Bạn bè")} className="text-blue-500 hover:underline">
                    Xem tất cả bạn bè
                  </button>
                </div>
                <p className="text-gray-500">464 người bạn</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {friends.slice(0, 9).map((friend, index) => (
                    <div key={index} className="text-center">
                      <img src={friend.img} className="w-full h-30 object-cover rounded-md" />
                      <p className="text-xs">{friend.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-3/5 p-4">
              {/* Thanh nhập trạng thái */}
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-2">
                <img src={user.avatarImage} alt="Avatar" className="w-10 h-10 rounded-full" />
                <input
                  type="text"
                  placeholder="Bạn đang nghĩ gì?"
                  onClick={openModal}
                  className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none cursor-pointer"
                  readOnly
                />
              </div>

              {/* Các tùy chọn đăng bài */}
              <div className="flex justify-around bg-white p-3 mt-3 rounded-lg shadow-md">
                <button
                  onClick={openModal}
                  className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-md border border-transparent transition-all duration-200 hover:bg-gray-300"
                >
                  📷 Ảnh/Video
                </button>

                <button
                  onClick={openModal}
                  className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-md border border-transparent transition-all duration-200 hover:bg-gray-300"
                >
                  📅 Sự kiện
                </button>
              </div>
              {/* Modal hiển thị */}
              <PostModal isOpen={isModalOpen} onClose={closeModal} onPost={handlePost} />
              {isEditFormOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg w-96 relative">
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-black"
                      onClick={() => setIsEditFormOpen(false)}
                    >
                      ✖
                    </button>
                    <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h2>
                    <form className="flex flex-col gap-3">
                      <div>
                        <label className="block text-sm font-semibold">Tên người dùng</label>
                        <input type="text" defaultValue={user.name} className="w-full border px-3 py-2 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh đại diện hiện tại</label>
                        <img src={user.avatarImage} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover mb-2" />
                        <input type="file" accept="image/*" className="w-full" onChange={handleAvatarChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh bìa hiện tại</label>
                        <img src={user.avatarImage} alt="Cover Preview" className="w-full h-32 object-cover mb-2 rounded" />
                        <input type="file" accept="image/*" className="w-full" onChange={handleCoverChange} />
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700">
                        Lưu thay đổi
                      </button>
                    </form>
                  </div>
                </div>
              )}
              {/* Tabs điều hướng bài viết */}
              <div className="flex justify-between bg-white p-3 mt-3 rounded-lg shadow-md">
                <div className="flex gap-4">
                  <label htmlFor="text" className="text-xl font-bold">Bài viết</label>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-600 cursor-pointer">⚙️ Bộ lọc</button>
                  <button className="text-gray-600 cursor-pointer">📁 Quản lý bài viết</button>
                </div>
              </div>
              {/* Danh sách bài viết */}
              <ProfilePost />
            </div>
          </div>
        )}
        {/* Phần bên phải (trống) */}
        <div className="w-1/5"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
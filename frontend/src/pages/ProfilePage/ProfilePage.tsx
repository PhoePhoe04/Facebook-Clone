import { useState } from "react";
import ProfileTabs from './ProfileTabs';
import ProfilePost from './ProfilePost';
import ProfileFriend from "./ProfileFriend";
import ProfilePhoto from "./ProfilePhoto";

const images = [
  "/images/dp1.png",
  "/images/dp2.png",
  "/images/dp3.png",
  "/images/dp4.png",
  "/images/dp1.png",
  "/images/dp2.png",
  "/images/dp3.png",
  "/images/dp4.png",
  "/images/dp1.png",
  "/images/dp2.png"
];

const friends = [
  { name: "Friend 1", img: "/images/dp1.png" },
  { name: "Friend 2", img: "/images/dp2.png" },
  { name: "Friend 3", img: "/images/dp3.png" },
  { name: "Friend 4", img: "/images/dp4.png" },
  { name: "Friend 5", img: "/images/dp1.png" },
  { name: "Friend 6", img: "/images/dp2.png" },
  { name: "Friend 7", img: "/images/dp3.png" },
  { name: "Friend 8", img: "/images/dp4.png" },
  { name: "Friend 9", img: "/images/dp1.png" },
  { name: "Friend 10", img: "/images/dp2.png" }
];

const user = {
  name: "Nguyễn Văn A",
  avatarImage: "/images/dp1.png",
  coverPreview:"/images/GYuWtZPXkAAA6WT.jpg",
  postsCount: 125
};

const ProfilePage = () => {
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [activeMain, setActiveMain] = useState("Bài viết");
  const [userData, setUserData] = useState(user);
  const [editName, setEditName] = useState(user.name);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAvatar = URL.createObjectURL(file);
      setAvatarPreview(newAvatar);
      setUserData((prev) => ({ ...prev, avatarImage: newAvatar }));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newCover = URL.createObjectURL(file);
      setCoverPreview(newCover);
      setUserData((prev) => ({ ...prev, coverPreview: newCover }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white-fff">
      {/* Header */}
      <div className="header bg-white w-full flex shadow-lg">
        {/* Phần bên trái (trống) */}
        <div className="w-1/5"></div>
        {/* Phần chính giữa (Center Side) */}
        <div className="w-3/5 rounded-xl">
          <div className="flex flex-col">
            {/* Phần ảnh bìa và ảnh đại diện */}
            <div className="relative">
              {/* Ảnh bìa */}
              <img src={coverPreview || userData.coverPreview} alt="Cover" className="w-full h-96 object-cover rounded-b-xl shadow-md"/>
              {/* Overlay + nút chỉnh sửa */}
              <label className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a1 1 0 011-1z" />
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <span className="text-sm font-semibold">Chỉnh sửa ảnh bìa</span>
                <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
              </label>
              {/* Ảnh đại diện */}
              <div className="flex items-end justify-between mt-[-110px] px-6">
                {/* Avatar + Tên + Số bạn bè */}
                <div className="flex items-end gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <img src={avatarPreview || userData.avatarImage} alt="Avatar" className="w-[200px] h-[200px] rounded-full border-4 border-white shadow-lg object-cover"/>
                    <label className="absolute bottom-2 right-2 bg-gray-200 p-1 rounded-full cursor-pointer hover:bg-gray-300">
                      <img src="/images/camera1.jpeg" alt="Chọn ảnh đại diện" className="h-5 w-5 object-contain"/>
                      <input type="file" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  {/* Tên và số bạn */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                    <p className="text-gray-500">{user.postsCount} người bạn</p>
                  </div>
                </div>
                {/* Các nút hành động */}
                <div className="flex gap-3">
                  {/* Nút chỉnh sửa */}
                  <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 shadow-md hover:bg-gray-200 transition font-semibold" 
                    onClick={() => setIsEditFormOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <span>Chỉnh sửa thông tin</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Phần thông tin người dùng */}
            <div className="px-6">
              <div className="mt-6">
                <ProfileTabs setActiveMain={setActiveMain} activeMain={activeMain} />
              </div>
            </div>
          </div>
        </div>
        {/* Phần bên phải (trống) */}
        <div className="w-1/5"></div>
      </div>

      <div className="main w-full flex">
        <div className="w-1/5"></div>
        {activeMain === "Bạn bè" ? (
          <ProfileFriend />
        ) : activeMain === "Ảnh" ? ( 
           <ProfilePhoto />
        ) : (
          <div className="w-3/5 flex flex-row min-h-screen">
            <div className="w-2/5 p-2 rounded-lg">
              {/* Ảnh */}
              <div className="mb-4 rounded-lg p-4 shadow-md bg-white">
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
              <div className="mb-4 rounded-lg p-4 shadow-md bg-white">
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
                      <p className="text-xs font-semibold">{friend.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-3/5 p-2">
              {isEditFormOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg w-96 relative">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-black"
                      onClick={() => setIsEditFormOpen(false)}>✖</button>
                    <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h2>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setUserData(prev => ({
                          ...prev,
                          name: editName,
                          avatarImage: avatarPreview || prev.avatarImage,
                          coverPreview: coverPreview || prev.coverPreview
                        }));
                        setIsEditFormOpen(false);
                      }}
                      className="flex flex-col gap-3"
                    >
                      <div>
                        <label className="block text-sm font-semibold">Tên người dùng</label>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border px-3 py-2 rounded-md" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh đại diện hiện tại</label>
                        <img src={avatarPreview || userData.avatarImage} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover mb-2" />
                        <input type="file" accept="image/*" className="w-full" onChange={handleAvatarChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh bìa hiện tại</label>
                        <img src={coverPreview || userData.coverPreview} alt="Cover Preview" className="w-full h-32 object-cover mb-2 rounded" />
                        <input type="file" accept="image/*" className="w-full" onChange={handleCoverChange} />
                      </div>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700">
                        Lưu thay đổi
                      </button>
                    </form>
                  </div>
                </div>
              )}
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
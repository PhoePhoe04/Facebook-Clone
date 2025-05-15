import { useState, useEffect, useRef } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

const friends = [
  { name: "Người dùng 1", mutual: 8, avatar: "/images/dp5.png" },
  { name: "Người dùng 2", mutual: 42, avatar: "/images/dp5.png" },
  { name: "Người dùng 3", mutual: 21, avatar: "/images/dp5.png" },
  { name: "Người dùng 4", mutual: 24, avatar: "/images/dp5.png" },
  { name: "Người dùng 5", mutual: 4, avatar: "/images/dp5.png" },
  { name: "Người dùng 6", mutual: 37, avatar: "/images/dp5.png" },
  { name: "Người dùng 7", mutual: 29, avatar: "/images/dp5.png" },
  { name: "Người dùng 8", mutual: 27, avatar: "/images/dp5.png" },
];

const ProfileFriend = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ✅ Đóng dropdown khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <div className="w-3/5 flex flex-col bg-white p-4 rounded-lg shadow-md mt-3 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Bạn bè</h2>
      <div className="grid grid-cols-2 gap-4">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            {/* Avatar & Tên */}
            <div className="flex items-center space-x-3">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{friend.name}</h3>
                <p className="text-sm text-gray-500">{friend.mutual} bạn chung</p>
              </div>
            </div>

            {/* Nút More Options */}
            <button
              onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
              className="p-2 rounded-full hover:bg-gray-300 transition"
            >
              <FiMoreHorizontal className="text-gray-600 text-xl" />
            </button>

            {/* Dropdown */}
            {openDropdown === index && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-12 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-10"
              >
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Xóa bạn
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Nhắn tin
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Báo cáo
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFriend;

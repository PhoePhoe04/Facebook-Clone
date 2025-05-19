import { useState, useEffect, useRef, useCallback } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

// const friends = [
//   { name: "Người dùng 1", mutual: 8, avatar: "/images/dp5.png" },
//   { name: "Người dùng 2", mutual: 42, avatar: "/images/dp5.png" },
//   { name: "Người dùng 3", mutual: 21, avatar: "/images/dp5.png" },
//   { name: "Người dùng 4", mutual: 24, avatar: "/images/dp5.png" },
//   { name: "Người dùng 5", mutual: 4, avatar: "/images/dp5.png" },
//   { name: "Người dùng 6", mutual: 37, avatar: "/images/dp5.png" },
//   { name: "Người dùng 7", mutual: 29, avatar: "/images/dp5.png" },
//   { name: "Người dùng 8", mutual: 27, avatar: "/images/dp5.png" },
// ];

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatarImage: string;
  avatarContentType: string;
  coverImage: string;
  coverContentType: string;
  bio: string;
  status: string;
  avatarUrl: string;
};

interface Friend {
  id: number;
  requester: User;
  receiver: User;
  status: string;
  createdAt: Date;
}

const ProfileFriend = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [mutualCounts, setMutualCounts] = useState<{ [userId: number]: number }>({});

  const currentUser = localStorage.getItem('currentUser');
  const currentUserId = currentUser ? JSON.parse(currentUser).id : null;

  // Lấy avatar
    const getAvatarSrc = (userData: User): string => {
      if(userData) {
        // Check if base64 data (avatarImage) and content type are available from backend
        if (userData.avatarImage && userData.avatarContentType) {
            // Correctly format the data URL
            return `data:${userData.avatarContentType};base64,${userData.avatarImage}`;
        }
        // If no base64 data, check for a remote URL (less common with file uploads but kept for compatibility)
        if (userData.avatarUrl) {
            return userData.avatarUrl;
        }
      }
        // Fallback to a default placeholder image if no avatar data is available
        // Make sure you have a 'placeholder-avatar.png' in your public directory
        return 'placeholder-avatar.png';
    };

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUserId) {
        try {
          const response = await fetch(`http://localhost:8080/api/friendships/userFriends/${currentUserId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Friend[] = await response.json();
          setFriends(data);
        } catch (error) {
          console.error("Lỗi khi tải danh sách bạn bè:", error);
        }
      }
    };

    fetchFriends();
  }, [currentUserId]);

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

  const getMutualFriendCount = useCallback(async (friendId: number): Promise<number> => {
    if (currentUserId) {
      try {
        const response = await fetch(`http://localhost:8080/api/friendships/getMutual?userId1=${currentUserId}&userId2=${friendId}`);
        if (!response.ok) {
          console.error(`Lỗi khi lấy số lượng bạn chung: ${response.status}`);
          return 0;
        }
        const data: number = await response.json();
        return data;
      } catch (error) {
        console.error("Lỗi khi gọi API lấy số lượng bạn chung:", error);
        return 0;
      }
    }
    return 0;
  }, [currentUserId]); // Thêm các dependency của getMutualFriendCount (nếu có)
  
  useEffect(() => {
    if(friends) {
      const fetchMutualCounts = async () => {
        const counts: { [userId: number]: number } = {};
        for (const friendship of friends) {
          const friendId = friendship.requester.id === currentUserId
            ? friendship.receiver.id
            : friendship.requester.id;
          counts[friendId] = await getMutualFriendCount(friendId);
        }
        setMutualCounts(counts);
      };

      if (friends.length > 0 && currentUserId) {
        fetchMutualCounts();
      }
    }
  }, [friends, currentUserId, getMutualFriendCount]);

  return (
    <div className="w-3/5 flex flex-col bg-white p-4 rounded-lg shadow-md mt-3 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Bạn bè</h2>
      <div className="grid grid-cols-2 gap-4">
        {friends?.map((friend, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            {/* Avatar & Tên */}
            <div className="flex items-center space-x-3">
              <img
                src={friend.requester.id === currentUserId ? getAvatarSrc(friend.receiver) || "/images/default-avatar.png" : getAvatarSrc(friend.requester) || "/images/default-avatar.png"}
                alt={friend.requester.id === currentUserId ? friend.receiver.name : friend.requester.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{friend.requester.id === currentUserId ? friend.receiver.name : friend.requester.name}</h3>
                <p className="text-sm text-gray-500">
                  {mutualCounts[friend.id] !== undefined // Vẫn cần kiểm tra theo friend.id vì friend được xác định ở đây
                    ? `${mutualCounts[friend.id]} bạn chung`
                    : '0 bạn chung'}
                </p>
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

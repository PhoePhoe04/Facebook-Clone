import React, { useState, useEffect, useRef } from 'react';
import { FiMoreHorizontal, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { User } from '../../type/type';

interface Friend {
  id: number;
  firstname: string;
  lastname: string;
  mutualFriends: string;
  avatar: string;
}

interface Friendship {
  id: number;
  requester: {
    id: number;
    name: string;
    image: string;
  };
  receiver: {
    id: number;
    name: string;
    image: string;
  };
  status: string;
  mutualFriends: number;
}


const FriendsList: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        console.log('Parsed currentUser:', parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8080/api/friendships/friends/${currentUser.id}`);
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách bạn bè');
        }
        const data: Friendship[] = await response.json();
        console.log('Friends:', data);

        const friendsList = data.map((friendship) => {
          const friend = friendship.requester.id === currentUser.id ? friendship.receiver : friendship.requester;
          const [firstname, ...lastnameParts] = friend.name.split(' ');
          const lastname = lastnameParts.join(' ');
          return {
            id: friend.id,
            firstname: firstname || '',
            lastname: lastname || '',
            mutualFriends: friendship.mutualFriends > 0 ? `${friendship.mutualFriends} bạn chung` : '',
            avatar: friend.image || '/images/default-avatar.jpg',
          };
        });

        setFriends(friendsList);
        setFilteredFriends(friendsList);
      } catch (err: any) {
        setError(err.message || 'Đã có lỗi xảy ra khi lấy danh sách bạn bè');
        console.error('Error fetching friends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFriends(friends);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = friends.filter((friend) => {
        const fullName = `${friend.firstname} ${friend.lastname}`.toLowerCase();
        return fullName.includes(query);
      });
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBack = () => {
    navigate('/friends');
  };

  // Điều hướng đến trang hồ sơ của bạn bè khi nhấn vào
  const handleFriendClick = (friendId: number) => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <div className="w-80 h-screen bg-white p-4 flex flex-col">
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-gray-200 transition mr-2"
        >
          <FiArrowLeft className="text-gray-600 text-xl" />
        </button>
        <h2 className="text-xl font-bold">Tất cả bạn bè</h2>
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm bạn bè"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 bg-gray-100 border-solid rounded-2xl placeholder-gray-400 focus:outline-none"
      />
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <p className="text-black font-medium mb-4">{filteredFriends.length} người bạn</p>
          <div className="flex-1 overflow-y-auto">
            {filteredFriends.length === 0 ? (
              <div>Không tìm thấy bạn bè nào.</div>
            ) : (
              filteredFriends.map((friend, index) => (
                <div
                  key={friend.id}
                  className="flex items-center p-2 mb-2 hover:bg-gray-100 rounded-lg cursor-pointer relative"
                  onClick={() => handleFriendClick(friend.id)} // Điều hướng khi nhấn vào bạn bè
                >
                  <img
                    src={friend.avatar}
                    alt={friend.firstname + ' ' + friend.lastname}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-black font-medium">{friend.firstname + ' ' + friend.lastname}</p>
                    {friend.mutualFriends && (
                      <p className="text-gray-400 text-sm">{friend.mutualFriends}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click trên div cha (điều hướng)
                      setOpenDropdown(openDropdown === friend.id ? null : friend.id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-300 transition"
                  >
                    <FiMoreHorizontal className="text-gray-600 text-xl" />
                  </button>
                  {openDropdown === friend.id && (
                    <div
                      ref={(el) => {
                        dropdownRef.current[index] = el;
                      }}
                      className="absolute right-8 top-12 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-10"
                    >
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                        Xóa bạn
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsList;
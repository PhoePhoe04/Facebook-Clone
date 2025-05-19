import React, { useState, useEffect } from 'react';
import SideBar from './components/sideBar';
import { SidebarItem } from './components/sideBar';
import FriendReqItem from './components/FriendReqItem';
import { User } from '../../type/type';

interface FriendRequest {
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
  mutualFriends: number; // Số lượng bạn chung
}

const FriendsPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchFriendRequests = async () => {
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8080/api/friendships/received/${currentUser.id}`);
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách lời mời kết bạn');
        }
        const data: FriendRequest[] = await response.json();
        console.log('Friend requests:', data);
        setFriendRequests(data);
      } catch (err: any) {
        setError(err.message || 'Đã có lỗi xảy ra khi lấy lời mời kết bạn');
        console.error('Error fetching friend requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [currentUser]);

  const handleAccept = (friendshipId: number) => {
    setFriendRequests((prev) => prev.filter((request) => request.id !== friendshipId));
  };

  const handleDelete = (friendshipId: number) => {
    setFriendRequests((prev) => prev.filter((request) => request.id !== friendshipId));
  };

  const SidebarItems: SidebarItem[] = [
    { label: 'Lời mời kết bạn', path: '/friends', iconPosition: { x: 0, y: -321 } },
 
   
    { label: 'Tất cả bạn bè', path: '/allFriend', iconPosition: { x: -72, y: 0 } },
  ];

  return (
    <div className="w-full sm:w-1/4 sm:pr-4 pr-0">
      <SideBar isMobile={false} title="Bạn bè" items={SidebarItems} />
      <div className="ml-[365px] mt-0.25">
        <div className="m-8">
          <div className="w-full pb-4 font-bold text-xl whitespace-nowrap flex">
            Lời mời kết bạn
          </div>
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : friendRequests.length === 0 ? (
            <div>Không có lời mời kết bạn nào.</div>
          ) : (
            <div className="grid grid-cols-4 gap-x-[230px] gap-y-[30px]">
              {friendRequests.map((data, index) => (
                <FriendReqItem
                  key={index}
                  friendshipId={data.id}
                  image={data.requester.image}
                  name={data.requester.name}
                  mutualFriends={data.mutualFriends > 0 ? `${data.mutualFriends} bạn chung` : undefined}
                  onAccept={handleAccept}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
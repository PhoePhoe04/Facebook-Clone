interface FriendReqItemProps {
  image: string;
  name: string;
  mutualFriends?: string;
  friendshipId: number;
  onAccept: (friendshipId: number) => void;
  onDelete: (friendshipId: number) => void; // Callback cho nút Xóa
}

const FriendReqItem = ({ image, name, mutualFriends, friendshipId, onAccept, onDelete }: FriendReqItemProps) => {
  const handleAccept = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/friendships/accept/${friendshipId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể chấp nhận lời mời kết bạn');
      }

      onAccept(friendshipId);
    } catch (err: any) {
      console.error('Error accepting friend request:', err);
      alert('Đã có lỗi xảy ra khi chấp nhận lời mời kết bạn');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/friendships/deleteFriend/${friendshipId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể xóa lời mời kết bạn');
      }

      onDelete(friendshipId);
    } catch (err: any) {
      console.error('Error deleting friend request:', err);
      alert('Đã có lỗi xảy ra khi xóa lời mời kết bạn');
    }
  };

  return (
    <div className="w-[210px] h-[360px] rounded-xl shadow bg-white overflow-hidden flex flex-col">
      {/* Ảnh */}
      <div className="h-[210px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      {/* Nội dung */}
      <div className="p-2 font-semibold flex flex-col justify-between flex-grow">
        <div className="text-[17px] text-gray-950">{name}</div>

        <div className="text-sm text-gray-500 h-[20px]">
          {mutualFriends ? (
            <span>{mutualFriends}</span>
          ) : (
            <span className="invisible">placeholder</span>
          )}
        </div>

        <div className="flex items-center flex-col gap-2 mt-2">
          <button
            className="w-[185px] bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700"
            onClick={handleAccept}
          >
            Xác nhận
          </button>
          <button
            className="w-[185px] bg-gray-200 text-black py-1.5 rounded-md hover:bg-gray-300"
            onClick={handleDelete}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendReqItem;
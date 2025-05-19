interface FriendReqItemProps {
    image: string;
    name: string;
    mutualFriends?: string; // bạn chung, có thể không có
  }
  
  const FriendReqItem = ({ image, name, mutualFriends }: FriendReqItemProps) => {
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
          <div className="text-[17px]">{name}</div>

          <div className="text-sm text-gray-500 h-[20px]">
            {mutualFriends ? (
              <span>{mutualFriends}</span>
            ) : (
              <span className="invisible">placeholder</span>
            )}
          </div>

          <div className="flex items-center flex-col gap-2 mt-2">
            <button className="w-[185px] bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700">
              Xác nhận
            </button>
            <button className="w-[185px] bg-gray-200 text-black py-1.5 rounded-md hover:bg-gray-300">
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  
  export default FriendReqItem;
  
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import spriteSheet from "/images/facebook-icon-sprite.png";

const user = {
  name: "Nguyễn Văn A",
  avatarImage: "/images/avatar.png",
  coverPreview:"images/GYuWtZPXkAAA6WT.jpg",
  postsCount: 125
};

const LeftSideBar = () => {
  const navigate = useNavigate();

  // Set mở rộng của menuItems
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleIconClick = (path: string) => {
    navigate(path);
  };

  // Tính toán cho các icon của sprite
  const calcHeight = (index: number) => {
    return `-${index * 37}px`;
  };

  // Danh sách icon với 0 là trục y vì hình các icon xếp dọc chiều thẳng đứng
  const menuItems = [
    { image: user.avatarImage, label: user.name, path: "/profile",isImage: true},
    { position: `0 ${calcHeight(9)}`, label: "Friends", path: "/friends", isImage: false },
    { position: `0 ${calcHeight(13)}`, label: "Memories", path: "/", isImage: false },
    { position: `0 ${calcHeight(5)}`, label: "Saved", path: "/", isImage: false },
    { position: `0 ${calcHeight(1)}`, label: "Groups", path: "/", isImage: false },
    { position: `0 ${calcHeight(15)}`, label: "Videos", path: "/", isImage: false },
    { position: `0 ${calcHeight(12)}`, label: "Marketplace", path: "/", isImage: false },
  ];

  // Chỉ hiển thị 5 item nếu chưa mở rộng
  const displayedItems = isExpanded ? menuItems : menuItems.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      <div className={"block"}>
        {/* Thanh cuộn tùy chỉnh */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <ul className="">
            {displayedItems.map((item, index) => (
              <li
                onClick={() => handleIconClick(item.path)}
                key={index}
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
              >
                {/* Icon từ sprite sheet */}
                {item.isImage ? (
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-[37px] w-[37px] rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="h-[37px] w-[37px]"
                    style={{
                      backgroundImage: `url(${spriteSheet})`,
                      backgroundPosition: item.position,
                      backgroundSize: "37px auto",
                    }}
                  />
                )}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nút See More */}
        <button
          onClick={toggleExpand}
          className="flex items-center mt-2 space-x-2 rounded-lg hover:bg-gray-100 w-full"
        >
          {isExpanded ? (
            <>
              <div className="p-2">
                <ChevronUpIcon className="h-[37px] w-[37px] bg-gray-300 rounded-full " />
              </div>
              <span>See Less</span>
            </>
          ) : (
            <>
              <div className="p-2">
                <ChevronDownIcon className="h-[37px] w-[37px] bg-gray-300 rounded-full" />
              </div>
              <span>See More</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LeftSideBar;

import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import { User } from "../../../type/type.ts";

import spriteSheet from "/images/facebook-icon-sprite.png";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Lấy user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        console.log("Parsed currentUser:", parsedUser); // Debug
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("currentUser"); // Xóa nếu dữ liệu lỗi
      }
    }
  }, []);

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
    {
      image: currentUser?.avatarImage,
      ImageType: currentUser?.avatarContentType,
      label: currentUser?.name,
      path: "/profile",
      isImage: true,
    },
    {
      position: `0 ${calcHeight(9)}`,
      label: "Friends",
      path: "/friends",
      isImage: false,
    },
    {
      position: `0 ${calcHeight(15)}`,
      label: "Videos",
      path: "/",
      isImage: false,
    },
  ];

  // Chỉ hiển thị 5 item nếu chưa mở rộng
  const displayedItems = isExpanded ? menuItems : menuItems.slice(0, 5);

  const getImageSrc = (image: string, imageType: string) => {
    if (!image) return undefined;
    // Nếu imageUrl đã là data URL hoàn chỉnh
    if (image.startsWith("data:image/")) {
      return image;
    }
    // Nếu imageUrl là Base64 thô, thêm prefix
    const mimeType = imageType || "image/jpeg"; // Mặc định jpeg nếu không có
    return `data:${mimeType};base64,${image}`;
  };

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
                    src={getImageSrc(item.image ?? "", item.ImageType ?? "")}
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
        {menuItems.length > 5 && (
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
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const LeftSideBar = ({ isMobile }: { isMobile: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: "👤", label: "Huỳnh Phúc Duy" },
    { icon: "👥", label: "Friends" },
    { icon: "⏰", label: "Memories" },
    { icon: "💾", label: "Saved" },
    { icon: "👥", label: "Groups" },
    { icon: "📹", label: "Video" },
    { icon: "🏪", label: "Marketplace" },
    { icon: "📡", label: "Feeds" },
    { icon: "🎉", label: "Events" },
    { icon: "📅", label: "Pages" },
    { icon: "🎮", label: "Gaming" },
    { icon: "💼", label: "Jobs" },
    { icon: "🔔", label: "Notifications" },
  ];

  // Chỉ hiển thị 5 item nếu chưa mở rộng
  const displayedItems = isExpanded ? menuItems : menuItems.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      {isMobile && (
        <button onClick={toggleCollapse} className="mb-4 text-gray-600">
          {isCollapsed ? "Show Menu" : "Hide Menu"}
        </button>
      )}

      <div className={isMobile && isCollapsed ? "hidden" : "block"}>
        {/* Thanh cuộn tùy chỉnh */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <ul className="p-2">
            {displayedItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <img src={item.icon} alt="" className="size-8 rounded-full" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nút See More */}
        <button
          onClick={toggleExpand}
          className="flex items-center space-x-2 mx-2 p-2 rounded-lg hover:bg-gray-100 w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="size-8 bg-gray-300 rounded-full p-2 " />
              <span>See Less</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="size-8 bg-gray-300 rounded-full p-2" />
              <span>See More</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LeftSideBar;

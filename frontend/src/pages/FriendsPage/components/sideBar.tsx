import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon,ChevronUpIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import spriteSheet from "/images/sprite3.png";


export interface SidebarItem {
  label: string;
  path: string;
  iconPosition?: { x: number; y: number }; // Tọa độ của icon trong sprite sheet
}


interface SideBarProps {
  isMobile: boolean;
  title: string;
  items: SidebarItem[];
}

const SideBar = ({ isMobile, title, items }: SideBarProps) => {
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bg-fixed left-0 h-screen w-[360px] bg-white shadow-md p-2 z-40 shadow-md p-2">
      {isMobile && (
        <button onClick={toggleCollapse} className="mb-4 text-gray-600">
          {isCollapsed ? "Show Menu" : "Hide Menu"}
        </button>
      )}

      <div className={isMobile && isCollapsed ? "hidden" : "block"}>
        <div>
          {/* Tiêu đề */}
          <div className="pl-2 pt-0.5 h-[37px]">
            <h1 className="font-bold text-2xl">{title}</h1>
          </div>

       
          <ul className="mt-3">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-2 h-[51px] hover:bg-gray-100 cursor-pointer rounded-md"
                onClick={() =>
                  {if (item.label === "Trang chủ") {
                    window.location.reload();
                  }
                  else
                
                   handleItemClick(item.path)}}
              >
             
                {item.iconPosition ? (
                  <div
                    className="w-[20px] h-[20px ] mr-3 bg-no-repeat"
                    style={{
                      backgroundImage: `url(${spriteSheet})`,
                      backgroundPosition: `${item.iconPosition.x}px ${item.iconPosition.y}px`,
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 mr-3 bg-gray-300 rounded-full" /> // Placeholder nếu không có icon
                )}
             
                <span className="font-semibold  ml-4 text-[17px]">{item.label}</span>
                  {
                    item.label !== "Trang chủ" && (
                      <ChevronRightIcon 
                      className="w-[23px] h-[23px] text-gray-600 ml-auto mr-[14px]" />

                    )
                  }
       
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
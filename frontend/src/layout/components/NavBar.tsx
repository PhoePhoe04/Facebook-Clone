import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "../../pages/Nofication/NotificationDropdown";
import { useChatContext } from '../../contexts/ChatContext';
import ChatList from "../../components/Chat/ChatList";

import {
  ChatBubbleLeftIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import fblogo from "/images/logo.png";
import homefb from "/images/homefb.png";
import friends from "/images/friendsfb.png";
import videos from "/images/ic_video2.png";

const user = {
  name: "Nguyễn Văn A",
  avatarImage: "/images/avatar.png",
};

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isListOpen, toggleChatList } = useChatContext();

  const [actived, setActived] = useState<string | null>(null);

  // 🟦 Khai báo state & ref đầy đủ
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // nếu cần dropdown option
  const notificationRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const optionRef = useRef<HTMLDivElement>(null); // nếu có dropdown nào khác

  // Cập nhật trạng thái actived dựa trên đường dẫn hiện tại
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActived("home");
    else if (path === "/friends") setActived("friends");
    else if (path === "/videos") setActived("videos");
    else if (path === "/profile") setActived("profile");
    else setActived(null);
  }, [location.pathname]);

  const handleIconClick = (iconName: string, path: string) => {
    setActived(iconName);
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // 🟨 Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        optionRef.current &&
        !optionRef.current.contains(event.target as Node) &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
        setShowNotifications(false);
        if (isListOpen) {
          toggleChatList();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isListOpen, toggleChatList]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-14">
      <div className="flex w-full mx-auto px-4">
        {/* Left */}
        <div className="w-1/4 flex items-center justify-start space-x-4">
          <img
            src={fblogo}
            alt="logo"
            onClick={() => handleIconClick("home", "/")}
            className="size-10 cursor-pointer"
          />
          <input
            type="text"
            placeholder="Search Facebook"
            className="text-black bg-gray-200 rounded-2xl h-10 w-3/4 p-4 outline-none"
          />
        </div>

        {/* Center */}
        <div className="w-1/2 flex items-center justify-center px-14">
          <div className="w-full h-full items-center justify-center hidden sm:flex">
            {[
              { name: "home", icon: homefb, path: "/" },
              { name: "videos", icon: videos, path: "/videos" },
              { name: "friends", icon: friends, path: "/friends" },
            ].map(({ name, icon, path }) => (
              <div
                key={name}
                className={`p-1 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
                  actived === name
                    ? "border-b-4 border-blue-600"
                    : "border-b-4 border-transparent"
                }`}
                onClick={() => handleIconClick(name, path)}
              >
                <img src={icon} alt={name} className="size-5 sm:size-6" />
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-1/4 flex items-center justify-end">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={chatRef}>
              <button 
                onClick={toggleChatList}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <ChatBubbleLeftIcon className="h-6 w-6 text-gray-800" />
              </button>

              {isListOpen && (
                <div className="absolute right-0 top-12 z-50">
                  <ChatList />
                </div>
              )}
            </div>

            <div className="relative" ref={notificationRef}>
              <button
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <BellIcon className="h-6 w-6 text-gray-800" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-[360px]">
                  <NotificationDropdown />
                </div>
              )}
            </div>

            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              onClick={() => handleIconClick("profile", "/profile")}
            >
              <img
                src={user.avatarImage}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>

            <button
              className="flex items-center px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-gray-700" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

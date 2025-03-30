import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Squares2X2Icon,
  ChatBubbleLeftIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import fblogo from "/images/logo.png";
import homefb from "/images/homefb.png";
import friends from "/images/friendsfb.png";
import videos from "/images/ic_video2.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [actived, setActived] = useState<string | null>(null);

  // Cập nhật thái actived dựa trên đường dẫn hiện tại
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActived("home");
    else if (path === "/friends") setActived("friends");
    else if (path === "/videos") setActived("videos");
    else if (path === "/profile") setActived("profile");
    else setActived(null);
  }, [location.pathname]);
  const handelIconClick = (iconName: string, path: string) => {
    setActived(iconName);
    navigate(path);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-14">
      <div className="flex w-full  mx-auto px-4">
        {/* left */}
        <div className="w-1/4 flex items-center justify-start space-x-4 ">
          <img src={fblogo} alt="logo" className="size-10" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="text-black bg-white rounded-2xl h-10 w-3/4 p-4"
          />
        </div>
        {/* Center */}
        <div className="w-1/2 flex items-center justify-center px-14">
          <div className=" w-full h-full items-center justify-center hidden sm:flex">
            <div
              className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
                actived === "home"
                  ? "border-b-4 border-blue-600 "
                  : "border-b-4 border-transparent"
              }`}
              onClick={() => handelIconClick("home", "/")}
            >
              <img src={homefb} alt="Home" className="size-5 sm:size-6" />
            </div>
            <div
              className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
                actived === "friends"
                  ? "border-b-4 border-blue-600"
                  : "border-b-4 border-transparent"
              }`}
              onClick={() => handelIconClick("friends", "/friends")}
            >
              <img src={friends} alt="Friends" className="size-5 sm:size-6" />
            </div>
            <div
              className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
                actived === "videos"
                  ? "border-b-4 border-blue-600"
                  : "border-b-4 border-transparent"
              }`}
              onClick={() => handelIconClick("videos", "/videos")}
            >
              <img src={videos} alt="Videos" className="size-5 sm:size-6" />
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="w-1/4 flex items-center justify-end">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <Squares2X2Icon className="h-6 w-6 text-gray-800" />
            </button>
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <ChatBubbleLeftIcon className="h-6 w-6 text-gray-800" />
            </button>
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <BellIcon className="h-6 w-6 text-gray-800" />
            </button>
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <UserCircleIcon className="h-6 w-6 text-gray-800" />
            </button>
          </div>
      </div>
    </div>
  );
};

export default NavBar;

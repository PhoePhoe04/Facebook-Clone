import { useState } from "react";

import homefb from "/images/homefb.png";
import friends from "/images/friendsfb.png";
import videos from "/images/video.png";
import groups from "/images/groupsfb.png";
import gaming from "/images/gamingfb.png";

const BottomNavBar = () => {
  const [actived, setActived] = useState<string | null>(null);

  const handleIconActived = (iconName: string) => {
    if (actived === iconName) {
      setActived(null);
    } else {
      setActived(iconName);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-t-md flex justify-around items-center p-2 sm:hidden">
      <div className="flex w-full h-full items-center justify-center">
        <div
          className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
            actived === "home"
              ? "border-b-4 border-blue-600 "
              : "border-b-4 border-transparent"
          }`}
          onClick={() => handleIconActived("home")}
        >
          <img src={homefb} alt="Home" className="size-5 sm:size-6" />
        </div>
        <div
          className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
            actived === "friends"
              ? "border-b-4 border-blue-600"
              : "border-b-4 border-transparent"
          }`}
          onClick={() => handleIconActived("friends")}
        >
          <img src={friends} alt="Friends" className="size-5 sm:size-6" />
        </div>
        <div
          className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
            actived === "videos"
              ? "border-b-4 border-blue-600"
              : "border-b-4 border-transparent"
          }`}
          onClick={() => handleIconActived("videos")}
        >
          <img src={videos} alt="Videos" className="size-5 sm:size-6" />
        </div>
        <div
          className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
            actived === "groups"
              ? "border-b-4 border-blue-600"
              : "border-b-4 border-transparent"
          }`}
          onClick={() => handleIconActived("groups")}
        >
          <img src={groups} alt="Groups" className="size-5 sm:size-6" />
        </div>
        <div
          className={`p-2 sm:p-3.5 cursor-pointer flex-1 flex justify-center hover:bg-gray-300 transition-colors ${
            actived === "gaming"
              ? "border-b-4 border-blue-600"
              : "border-b-4 border-transparent"
          }`}
          onClick={() => handleIconActived("gaming")}
        >
          <img src={gaming} alt="Gaming" className="size-5 sm:size-6" />
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;

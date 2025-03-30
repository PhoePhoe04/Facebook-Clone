import { useState, useEffect } from "react";
import LeftSideBar from "./components/LeftSideBar";
import Middle from "./components/Middle";
import RightSidebar from "./components/RightSideBar";

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row w-full mx-auto px-4 py-6 flex-1">
      {/* Sidebar trái */}
      <div
        className={`${
          isMobile
            ? "w-full mb-4"
            : "w-1/4 pr-4 sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto"
        }`}
      >
        <LeftSideBar isMobile={isMobile} />
      </div>

      {/* Main content */}
      <div
        className={`${
          isMobile ? "w-full " : "w-1/2 px-4 h-[calc(100vh-56px)]"
        } flex-1 overflow-y-auto scroll-smooth`}
      >
        <Middle />
      </div>

      {/* Sidebar phải (ẩn trên mobile) */}
      <div
        className={`${
          isMobile
            ? "hidden"
            : "w-1/4 pl-4 sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto"
        }`}
      >
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;

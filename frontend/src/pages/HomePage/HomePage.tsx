import LeftSideBar from "./components/LeftSideBar";
import Middle from "./components/Middle";
import RightSidebar from "./components/RightSideBar";

const HomePage = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full mx-auto px-1 py-2 flex-1">
      {/* Sidebar trái */}
      <div className="w-1/4 px-1 sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto pt-1">
        <LeftSideBar />
      </div>

      {/* Main content */}
      <div className="w-1/2 px-3">
        <Middle />
      </div>

      {/* Sidebar phải (ẩn trên mobile) */}
      <div className="w-1/4 px-1 sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto pt-1">
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;

import Middle from "./components/Middle.tsx";
import LeftSideBar from "./components/LeftSideBar.tsx";
import RightSideBar from "./components/RightSideBar.tsx";

const HomePage = () => {
  return (
    <div className="flex flex-row py-2">
      {/* Left Side */}
      <div className={`w-full sm:w-1/4 pr-0 sm:pr-4 `}>
        <LeftSideBar isMobile={false} />
      </div>

      {/* Content */}
      <div className="w-full sm:w-1/2 px-0 sm:px-4">
        <Middle />
      </div>

      {/* Right Side */}
      <div className="w-1/4 border-2 border-blue-500">
        <RightSideBar />
      </div>
    </div>
  );
};

export default HomePage;

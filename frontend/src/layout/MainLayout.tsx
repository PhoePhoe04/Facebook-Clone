import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Heder cố định */}
      <NavBar />

      {/* Content */}
      <div className="bg-gray-100 text-black flex flex-col min-h-screen pt-14 pb-0 sm:pb-0">
        <Outlet />
      </div>

      {/* Footer mobile */}
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;

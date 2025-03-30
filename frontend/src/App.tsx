import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import MainLayout from "./layout/MainLayout";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import VideosPage from "./pages/VideosPage/VideosPage";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import GamingPage from "./pages/GamingPage/GamingPage";
import AdminDashboard from "./pages/AdminPage/AdminPage";

function App() {
  return (
    <Routes>
      {/* Route dành cho giao diện người dùng */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/gaming" element={<GamingPage />} />
        <Route path="*" element={<div>404</div>} />
      </Route>

      {/* Route dành riêng cho Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
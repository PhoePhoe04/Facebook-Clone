import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import MainLayout from "./layout/MainLayout";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import VideosPage from "./pages/VideosPage/VideosPage";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import GamingPage from "./pages/GamingPage/GamingPage";
import LoginPage from "./pages/Login and Register/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegisterPage from "./pages/Login and Register/RegisterPage";
import ProfileFriend from "./pages/ProfilePage/ProfileFriend";
import ProfilePhoto from "./pages/ProfilePage/ProfilePhoto";
import ProfileAbout from "./pages/ProfilePage/ProfileAbout";

import AdminDashboard from "./pages/AdminPage/AdminPage";
import FriendsList from "./pages/FriendsPage/all-friends";

function App() {
  return (
    <>
      <Routes>
        {/* Route dành cho giao diện người dùng */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/all-friends" element={<FriendsList />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/gaming" element={<GamingPage />} />
          <Route path="/profile" element={<ProfilePage />}>
            <Route path="friend" element={<ProfileFriend />} />
            <Route path="photo" element={<ProfilePhoto />} />
            <Route path="about" element={<ProfileAbout />} />
          </Route>
          <Route path="*" element={<div>404</div>} />
        </Route>

        {/* Route dành riêng cho Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
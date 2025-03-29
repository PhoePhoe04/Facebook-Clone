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

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/gaming" element={<GamingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<div>404</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

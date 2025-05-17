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
    
import AdminDashboard from "./pages/AdminPage/AdminPage";
import ChatContainer from "./components/Chat/ChatContainer";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  return (
    <ChatProvider>
      <Routes>
        {/* Route dành cho giao diện người dùng */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/gaming" element={<GamingPage />} />
          <Route path="/profile" element={<ProfilePage />}>
            <Route path="friend" element={<ProfileFriend />} />
            <Route path="photo" element={<ProfilePhoto />} />
          </Route>
          <Route path="*" element={<div>404</div>} />
        </Route>
        
        {/* Route dành riêng cho Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {/* Chat Container */}
      <ChatContainer />
    </ChatProvider>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import MainLayout from "./layout/MainLayout";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import VideosPage from "./pages/VideosPage/VideosPage";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import GamingPage from "./pages/GamingPage/GamingPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/gaming" element={<GamingPage />} />
          <Route path="*" element={<div>404</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

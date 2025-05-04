import { useNavigate } from "react-router-dom";

const ProfileTabs = ({ setActiveMain, activeMain }: { setActiveMain: (tab: string) => void; activeMain: string }) => {
  const tabs = ["Bài viết", "Giới thiệu", "Bạn bè", "Ảnh"];
  const navigate = useNavigate(); // ✅ Khai báo useNavigate

  const handleTabClick = (tab: string) => {
    setActiveMain(tab);
    if (tab === "Bạn bè") {
      navigate("/profile/friend"); // ✅ Chuyển hướng đến /profile/friend khi nhấn vào "Bạn bè"
    } else if (tab === "Ảnh") {
      navigate("/profile/photo"); // ✅ Chuyển hướng đến /profile/photo khi nhấn vào "Ảnh"
    } else if (tab === "Giới thiệu") {
      navigate("/profile/about"); // ✅ Chuyển hướng đến /profile/photo khi nhấn vào "Ảnh"
    } else {
      navigate("/profile"); // ✅ Chuyển hướng về /profile cho các tab khác
    }
  };

  return (
    <div className="mt-6 mb-2 border-t border-gray-700 pt-2">
      <ul className="flex gap-6 text-gray-400">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`pb-2 cursor-pointer ${
              activeMain === tab ? "border-b-2 border-blue-600 text-blue-600 cursor-default" : ""
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileTabs;

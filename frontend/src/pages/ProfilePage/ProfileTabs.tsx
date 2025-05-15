import { useNavigate } from "react-router-dom";

const ProfileTabs = ({ setActiveMain, activeMain }: { setActiveMain: (tab: string) => void; activeMain: string }) => {
  const tabs = ["Bài viết", "Bạn bè", "Ảnh"];
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    setActiveMain(tab);
    if (tab === "Bạn bè") {
      navigate("/profile/friend");
    } else if (tab === "Ảnh") {
      navigate("/profile/photo");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="mt-6 mb-2 border-t pt-2"style={{ borderColor: "oklch(0.58 0.02 120.54 / 0.29)" }}>
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

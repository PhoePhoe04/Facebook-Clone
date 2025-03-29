import { useState } from "react";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("Bài viết");

  const tabs = ["Bài viết", "Giới thiệu", "Bạn bè", "Ảnh", "Video", "Xem thêm"];

  return (
    <div className="mt-6 mb-2 border-t border-gray-700 pt-2">
      <ul className="flex gap-6 text-gray-400">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`pb-2 cursor-pointer ${
              activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 cursor-default" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
        </li>        
        ))}
      </ul>
    </div>
  );
};

export default ProfileTabs;

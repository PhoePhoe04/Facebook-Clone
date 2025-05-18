import {
  ChartBarIcon,
  VideoCameraIcon,
  PhotoIcon,
  PresentationChartBarIcon,
  GlobeAltIcon,
  InboxArrowDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const menuItems: SidebarItem[] = [
  { icon: ChartBarIcon, label: "Trang chủ", path: "/" },
  { icon: VideoCameraIcon, label: "Trực tiếp", path: "/live" },
  { icon: PhotoIcon, label: "Reels", path: "/reels" },
  { icon: PresentationChartBarIcon, label: "Chương trình", path: "/shows" },
  { icon: GlobeAltIcon, label: "Khám phá", path: "/explore" },
  { icon: InboxArrowDownIcon, label: "Video đã lưu", path: "/saved" },
];

const SidebarLeft = () => {
  const navigate = useNavigate();

  const handleClick = (item: SidebarItem) => {
    if (item.label === "Trang chủ") {
      window.location.reload(); // Reload trang chủ
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed top-15 left-0 h-screen w-[360px] bg-white shadow-md p-2 z-40">
      {/* Tiêu đề */}
      <div className="pl-2 pt-0.5 h-[37px]">
        <h1 className="font-bold text-2xl">Video</h1>
      </div>

      {/* Danh sách menu */}
      <ul className="mt-3">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <li
              key={idx}
              onClick={() => handleClick(item)}
              className="flex items-center p-2 h-[51px] hover:bg-gray-100 cursor-pointer rounded-md"
            >
              <Icon className="w-[20px] h-[20px] mr-3 text-gray-600" />
              <span className="font-semibold ml-4 text-[17px]">{item.label}</span>
              {item.label !== "Trang chủ" && (
                <ChevronRightIcon className="w-[23px] h-[23px] text-gray-600 ml-auto mr-[14px]" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarLeft;

import {
  HomeIcon,
  PlayCircleIcon,
  FilmIcon,
  TvIcon,
  RocketLaunchIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { icon: <HomeIcon className="h-6 w-6" />, label: "Trang chủ" },
  { icon: <PlayCircleIcon className="h-6 w-6" />, label: "Trực tiếp" },
  { icon: <FilmIcon className="h-6 w-6" />, label: "Reels" },
  { icon: <TvIcon className="h-6 w-6" />, label: "Chương trình" },
  { icon: <RocketLaunchIcon className="h-6 w-6" />, label: "Khám phá" },
  { icon: <BookmarkIcon className="h-6 w-6" />, label: "Video đã lưu" },
];

const SidebarLeft = () => {
  return (
    <div className="w-64 bg-white p-4 shadow-md h-screen overflow-y-auto hidden md:block">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm video"
          className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      <ul className="space-y-2">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer"
          >
            {item.icon}
            <span className="text-base">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarLeft;

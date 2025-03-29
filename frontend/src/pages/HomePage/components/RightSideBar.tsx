import {
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

const RightSideBar = () => {
  // Dữ liệu tạm thời cho danh sách liên hệ
  const contacts = [
    {
      id: 1,
      name: "Nguyen Van A",
      avatar: "/images/avatar.png",
      isOnline: true,
    },
    {
      id: 2,
      name: "Cửu Linh Nguyên Thánh",
      avatar: "/images/avatar2.jpg",
      isOnline: false,
    },
    {
      id: 3,
      name: "Doãn Đại Hiệp",
      avatar: "/images/avatar3.webp",
      isOnline: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Tiêu đề và nút */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:bg-gray-200 rounded-full p-1">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:bg-gray-200 rounded-full p-1">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Danh sách liên hệ */}
      <ul className="space-y-2">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center space-x-3 hover:bg-gray-200 p-2 cursor-pointer"
          >
            {/* Avatar và trạng thái online */}
            <div className="relative">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="h-9 w-9 rounded-full"
              />
              {contact.isOnline && (
                <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            {/* Tên người dùng */}
            <span className="text-gray-800">{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSideBar;

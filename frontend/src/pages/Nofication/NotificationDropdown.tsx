import { useState } from "react";

interface Notification {
  id: number;
  image: string;
  content: string;
  time: string;
  unread?: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: 1,
    image: "https://i.pravatar.cc/40?img=1",
    content: "<strong>Hải Vy</strong> đã mời bạn tham gia nhóm công khai <strong>LOVING MOS-APTIS-TOEIC-VTSEP</strong>.",
    time: "15 giờ",
    unread: true,
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/40?img=2",
    content: "Một quản trị viên đã thay đổi tên nhóm từ <strong>SGU Confessions - Tr...</strong> thành <strong>SGU Confessions - Đại H...</strong>.",
    time: "16 giờ",
    unread: true,
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/40?img=3",
    content: "<strong>Tròn Giải Trí</strong> đã đăng video mới.",
    time: "2 ngày",
    unread: true,
  },
  {
    id: 4,
    image: "https://i.pravatar.cc/40?img=4",
    content: "<strong>Tuấn Kiệt Văn</strong> và <strong>Thanh Tuyền</strong> đã nhắc đến bạn.",
    time: "3 ngày",
    unread: false,
  },
];

const NotificationDropdown = () => {
  const [notifications] = useState<Notification[]>(sampleNotifications);

  return (
    <div className="w-[380px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Thông báo</h2>
        <div className="flex space-x-4 text-sm text-blue-600">
          <button className="hover:underline">Tất cả</button>
          <button className="hover:underline">Chưa đọc</button>
        </div>
      </div>
      <div className="max-h-[450px] overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-100 ${
              n.unread ? "bg-gray-50" : ""
            }`}
          >
            <img src={n.image} alt="avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p
                className="text-sm text-gray-800"
                dangerouslySetInnerHTML={{ __html: n.content }}
              ></p>
              <p className="text-xs text-gray-500 mt-1">{n.time}</p>
            </div>
            {n.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;

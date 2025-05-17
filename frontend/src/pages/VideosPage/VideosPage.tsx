import { useState } from "react";
import SidebarLeft from "./SidebarLeft"; // ✅ import sidebar

import {
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const VideosPage = () => {
  const users = [
    { id: 1, name: "Lợi Nguyễn", avatar: "/images/avatarloi.jpg" },
    { id: 2, name: "Nghĩa Hà", avatar: "/images/avatarNH.png" },
    { id: 3, name: "Huỳnh Phúc Duy", avatar: "/images/avatar.png" },
  ];

  const [videos, setVideos] = useState([
    {
      id: 1,
      userId: 1,
      content: "Vlog ăn sh*t cùng Lợi",
      videoUrl: "/videos/video1.mp4",
      timestamp: "Yesterday at 10:30",
      likes: 87,
      comments: 22,
      shares: 7,
      isLiked: false,
    },
    {
      id: 2,
      userId: 2,
      content: "Happy birld to Em💞",
      videoUrl: "/videos/video2.mp4",
      timestamp: "2 hours ago",
      likes: 123,
      comments: 11,
      shares: 2,
      isLiked: false,
    },
    {
      id: 3,
      userId: 3,
      content: "A a a",
      videoUrl: "/videos/video3.mp4",
      timestamp: "Last night",
      likes: 232,
      comments: 94,
      shares: 11,
      isLiked: false,
    },
  ]);

  const handleLike = (id: number, newLikes: number, newIsLiked: boolean) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, likes: newLikes, isLiked: newIsLiked } : v
      )
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar trái */}
      <div className="w-1/4 p-4">
        <SidebarLeft />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-4">
        {videos.map((video) => {
          const user = users.find((u) => u.id === video.userId);
          if (!user) return null;

          return (
            <div
              key={video.id}
              className="bg-white shadow-md rounded-md p-4 mb-4 max-w-[900px] mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="font-semibold text-black">
                      {user.name}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm space-x-1">
                      <span>{video.timestamp}</span>
                      <span>·</span>
                      <GlobeAltIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-500 hover:bg-gray-200 rounded-full p-1">
                    <EllipsisHorizontalIcon className="h-6 w-6" />
                  </button>
                  <button className="text-gray-500 hover:bg-gray-200 rounded-full p-1">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Video */}
              <div className="px-2">
                <p className="text-black mb-3">{video.content}</p>
                <div className="flex justify-center">
                  <video controls className="w-full max-h-[500px] object-contain">
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Footer */}
              <div className="px-3 pb-3 border-t border-gray-200">
                <div className="flex justify-between text-gray-500 text-sm py-2">
                  <div className="flex items-center space-x-1">
                    <HandThumbUpIcon className="h-4 w-4 text-blue-500" />
                    <span>{video.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span>{video.comments} comments</span>
                    <span>{video.shares} shares</span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <button
                    onClick={() =>
                      handleLike(
                        video.id,
                        video.isLiked ? video.likes - 1 : video.likes + 1,
                        !video.isLiked
                      )
                    }
                    className={`flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 ${
                      video.isLiked ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-500">
                    <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                    <span>Comment</span>
                  </button>
                  <button className="flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-500">
                    <ShareIcon className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideosPage;

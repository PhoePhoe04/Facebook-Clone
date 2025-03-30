import { useState } from "react";
import {
  ChatBubbleOvalLeftIcon,
  HandThumbUpIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  GlobeAltIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Phần Header của video
const HeaderPost = ({
  name,
  avatar,
  timestamp,
}: {
  name: string;
  avatar: string;
  timestamp: string;
}) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="h-10 w-10 rounded-full border-2 border-white"
          />
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-black">{name}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <span>{timestamp}</span>
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
  );
};

// Component Videos
const Videos = ({
  id,
  name,
  avatar,
  timestamp,
  content,
  videoUrl,
  likes,
  comments,
  shares,
  isLiked,
  onLike,
}: {
  id: number;
  name: string;
  avatar: string;
  timestamp: string;
  content: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: (id: number, newLikes: number, newIsLiked: boolean) => void;
}) => {
  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    const newIsLiked = !isLiked;
    onLike(id, newLikes, newIsLiked);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4 max-w-[900px] mx-auto">
      <HeaderPost name={name} avatar={avatar} timestamp={timestamp} />
      <div className="px-2">
        <p className="text-black mb-3">{content}</p>
        <div className="flex justify-center">
        <video controls className="w-full h-full object-contain">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </div>
      </div>
      <div className="px-3 pb-3 border-t border-gray-200">
        <div className="flex justify-between text-gray-500 text-sm py-2">
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">😂</span>
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <span>{comments} comments</span>
            <span>{shares} shares</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <button
            onClick={handleLike}
            className={`flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 ${
              isLiked ? "text-blue-500" : "text-gray-500"
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
};

// Component Middle
const Middle = () => {
  const users = [
    {
      id: 1,
      name: "Lợi Nguyễn",
      avatar: "/images/avatarloi.jpg",
      isOnline: true,
    },
    {
      id: 2,
      name: "Nghĩa Hà",
      avatar: "/images/avatarNH.png",
      isOnline: true,
    },
    {
      id: 3,
      name: "Huỳnh Phúc Duy",
      avatar: "/images/avatar.png",
      isOnline: true,
    },
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
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === id ? { ...video, likes: newLikes, isLiked: newIsLiked } : video
      )
    );
  };

  return (
    <>
      {videos.map((video) => {
        const user = users.find((u) => u.id === video.userId);
        if (!user) return null;
        return <Videos key={video.id} {...video} name={user.name} avatar={user.avatar} onLike={handleLike} />;
      })}
    </>
  );
};

export default Middle;
export { Videos };

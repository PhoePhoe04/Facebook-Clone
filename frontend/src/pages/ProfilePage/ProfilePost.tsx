import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const ProfilePost = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Người dùng 1",
      avatar: "/images/dp1.png",
      timestamp: "2 giờ trước",
      content: "Hôm nay là một ngày đẹp trời!",
      image: "/images/pic1.jpeg",
      likes: 12,
      comments: 5,
      shares: 2,
      isLiked: false,
    },
    {
      id: 2,
      name: "Người dùng 2",
      avatar: "/images/dp2.png",
      timestamp: "4 giờ trước",
      content: "Cảnh này thật tuyệt vời!",
      image: "/images/pic2.jpeg",
      likes: 30,
      comments: 10,
      shares: 4,
      isLiked: true,
    },
  ]);

  // Xử lý khi nhấn Like
  const handleLike = (id: number, newLikes: number, newIsLiked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: newLikes, isLiked: newIsLiked } : post
      )
    );
  };

  return (
    <div className="mt-4">
      {posts.map((post) => (
        <Post key={post.id} {...post} onLike={handleLike} />
      ))}
    </div>
  );
};

// Component Post nằm trong cùng file ProfilePost.tsx
const Post = ({
  id,
  name,
  avatar,
  timestamp,
  content,
  image,
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
  image: string;
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
    <div className="rounded-md bg-white shadow-md mb-4">
      <div className="flex items-center p-3">
        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
        <div>
          <p className="text-black font-semibold">{name}</p>
          <p className="text-gray-500 text-xs">{timestamp}</p>
        </div>
      </div>
      <div className="px-2">
        <p className="text-black mb-3">{content}</p>
        <div className="flex justify-center">
          <img
            src={image}
            alt="Post Image"
            className="max-w-[500px] max-h-[500px] w-full h-auto object-contain rounded-md"
          />
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

export default ProfilePost;

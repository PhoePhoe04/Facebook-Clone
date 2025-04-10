import { useEffect, useRef, useState } from "react";
import {
  ChatBubbleOvalLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HandThumbUpIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  GlobeAltIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// What's on your mind
const YoursMind = () => {
  return (
    <div className="flex flex-col shadow-md mb-4 bg-white p-4 rounded-md space-y-2">
      <div className="flex space-x-2 border-b-1 border-gray-200 pb-2">
        <img src="/images/avatar.png" alt="" className="rounded-full" />
        <input
          type="text"
          placeholder="What's on your mind, ... ?"
          className="bg-gray-100 w-full px-2 rounded-2xl"
        />
      </div>
      <div className="flex">
        <div className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md">
          <img src="/images/live_video.png" alt="" className="size-7 " />
          <label htmlFor="">Live video</label>
        </div>
        <div className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md">
          <img src="/images/photo_video.png" alt="" className="size-7 " />
          <label htmlFor="">Photo/video</label>
        </div>
        <div className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md">
          <img src="/images/feeling_activity.png" alt="" className="size-7 " />
          <label htmlFor="">Feeling/activity</label>
        </div>
      </div>
    </div>
  );
};

// Stories
const Stories = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkScroll();
    const storiesElement = storiesRef.current;
    storiesElement?.addEventListener("scroll", checkScroll);
    return () => storiesElement?.removeEventListener("scroll", checkScroll);
  }, []);

  // Kiểm tra trạng thái scroll
  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // trừ 1 để tránh lỗi làm tròn
    }
  };

  // Tính toán scroll
  const storyWidth = 144; // 144px = w-36
  const gap = 16; // 16px = gap-4
  const storiesPerView = 3; // Hiển thị 4 stories
  const scrollDistance =
    storiesPerView * storyWidth + (storiesPerView - 1) * gap; // 4 stories + 3 gaps

  // Cuộn sang trái
  const scrollLeft = () => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({
        left: -scrollDistance,
        behavior: "smooth",
      });
    }
  };

  // Cuộn sang phải
  const scrollRight = () => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="relative mb-4">
        {/* Left scroll */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
          </button>
        )}

        {/* Stories container */}
        <div
          ref={storiesRef}
          className="flex flex-row gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
        >
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 1
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 2
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 3
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 4
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 5
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 6
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 7
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 8
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 9
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 10
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 11
          </div>
          <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
            Story 12
          </div>
        </div>

        {/* Right scroll */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-800" />
          </button>
        )}
      </div>
    </>
  );
};

// Phần Header của Post
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
      {/* Avatar và thông tin người dùng */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={avatar} // Thay bằng đường dẫn avatar của bạn
            alt={name}
            className="h-10 w-10 rounded-full border-2 border-white"
          />
        </div>

        {/* Tên và thời gian */}
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

      {/* Nút More và Close */}
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

// Phần contents của Post
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
      <HeaderPost name={name} avatar={avatar} timestamp={timestamp} />
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

const Middle = () => {
  // mock data
  const users = [
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

  const [posts, setPosts] = useState([
    {
      id: 1,
      userId: 1,
      content: "Người cá ?",
      image: "/images/post1.png",
      timestamp: "Yesterday at 10:30",
      likes: 12000,
      comments: 426,
      shares: 45,
      isLiked: false,
    },
    {
      id: 2,
      userId: 2,
      content: "Siêu Thần Thú",
      image: "/images/post2.jpg",
      timestamp: "2 hours ago",
      likes: 15000,
      comments: 532,
      shares: 67,
      isLiked: true,
    },
    {
      id: 3,
      userId: 3,
      content: "",
      image: "/images/post3.jpg",
      timestamp: "5 minutes ago",
      likes: 2300,
      comments: 89,
      shares: 12,
      isLiked: false,
    },
  ]);

  const handleLike = (id: number, newLikes: number, newIsLiked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, likes: newLikes, isLiked: newIsLiked }
          : post
      )
    );
  };

  return (
    <>
      {/* Whats on your mind */}
      <YoursMind />
      {/* Stories */}
      <Stories />

      {/* Posts */}
      {posts.map((post) => {
        const user = users.find((u) => u.id === post.userId);
        if (!user) return null;
        return (
          <Post
            key={post.id}
            id={post.id}
            name={user.name}
            avatar={user.avatar}
            timestamp={post.timestamp}
            content={post.content}
            image={post.image}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            isLiked={post.isLiked}
            onLike={handleLike}
          />
        );
      })}
    </>
  );
};

export default Middle;

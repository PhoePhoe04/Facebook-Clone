import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  ChatBubbleOvalLeftIcon,
  HandThumbUpIcon,
  ShareIcon,
  GlobeAltIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Comment {
  id: number;
  name: string;
  avatar: string;
  text: string;
  image?: string | null;
  timestamp: string;
  likeCount?: number;
}

interface Post {
  id: number;
  userId: number;
  content: string;
  image: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  commentList: Comment[];
}

// Component: What's on your mind
const YoursMind = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const onClose = () => {
    setShowPostForm(false);
    setPostContent("");
    setSelectedImage(null);
  };

  const onPost = (content: string, image: string | null) => {
    console.log("Bài viết:", { content, image });
  };


  return (
    <>
      <div className="flex flex-col shadow-md mb-4 bg-white p-4 rounded-md space-y-2">
        <div className="flex space-x-2 border-b-1 border-gray-200 pb-2">
          <img src="/images/avatar.png" alt="" className="rounded-full" />
          <input
            type="text"
            placeholder="What's on your mind, ... ?"
            className="bg-gray-100 w-full px-2 rounded-2xl cursor-pointer"
            readOnly
            onClick={() => setShowPostForm(true)}
          />
        </div>
        <div className="flex">
          <div
            className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md cursor-pointer"
            onClick={() => setShowPostForm(true)}
          >
            <img src="/images/live_video.png" alt="" className="size-7" />
            <label>Live video</label>
          </div>
          <div
            className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md cursor-pointer"
            onClick={() => setShowPostForm(true)}
          >
            <img src="/images/photo_video.png" alt="" className="size-7" />
            <label>Photo/video</label>
          </div>
          <div
            className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md cursor-pointer"
            onClick={() => setShowPostForm(true)}
          >
            <img src="/images/feeling_activity.png" alt="" className="size-7" />
            <label>Feeling/activity</label>
          </div>
        </div>
      </div>

      {/* Form tạo bài viết */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-md p-4 relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-center">Tạo bài viết</h2>

            <div className="flex items-center mt-4 gap-2">
              <img
                src="/images/dp1.png"
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Tên người dùng</p>
              </div>
            </div>

            <textarea
              rows={4}
              value={postContent}
              onChange={handleChange}
              placeholder="Bạn đang nghĩ gì?"
              className="w-full mt-4 resize-none outline-none border-none placeholder-gray-500 text-lg"
            />

            {selectedImage && (
              <div className="mt-4">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-h-60 rounded border"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-sm text-red-500 mt-2 hover:underline"
                >
                  Xóa ảnh
                </button>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center border rounded p-2 text-sm text-gray-600">
              <span>Thêm vào bài viết của bạn</span>
              <div className="flex gap-2">
                <img
                  src="/images/photo_video.png"
                  alt="Ảnh"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() =>
                    document.getElementById("fileInput")?.click()
                  }
                />
                <img
                  src="/images/groups.png"
                  alt="Gắn nhóm"
                  className="w-6 h-6 cursor-pointer"
                />
                <img
                  src="/images/feeling_activity.png"
                  alt="Cảm xúc"
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleImageSelect}
            />

            <button
              disabled={postContent.trim() === ""}
              onClick={() => {
                onPost(postContent, selectedImage);
                onClose();
              }}
              className={`w-full mt-4 py-2 rounded font-semibold ${
                postContent.trim() === ""
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
            >
              Đăng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Component: HeaderPost
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
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full border-2 border-white" />
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

// Component: Post
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
  commentList,
  onLike,
  onAddComment,
  onLikeComment,
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
  commentList: any[];
  onLike: (id: number, newLikes: number, newIsLiked: boolean) => void;
  onLikeComment: (postId: number, commentId: number) => void;
  onAddComment: (postId: number, text: string, image?: string) => void;
}) => {
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    onLike(id, newLikes, !isLiked);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCommentImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() !== "" || commentImage) {
      onAddComment(id, commentText.trim(), commentImage || undefined);
      setCommentText("");
      setCommentImage(null);
    }
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
            <span className="text-blue-500">👍</span>
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <span>{commentList.length} comments</span>
            <span>{shares} shares</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <button
            onClick={handleLike}
            className={`flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 ${isLiked ? "text-blue-500" : "text-gray-500"}`}
          >
            <HandThumbUpIcon className="h-5 w-5" />
            <span>Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <ChatBubbleOvalLeftIcon className="h-5 w-5" />
            <span>Comment</span>
          </button>
          <button className="flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-500">
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-4 py-2">
          {/* Input comment */}
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center relative w-full">
              <img
                src="/images/dp5.png"
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                placeholder="Viết bình luận..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 pr-10 text-base focus:outline-none"
              />

              {/* Emoji & Upload */}
              <label htmlFor={`file-input-${id}`} className="absolute right-3 cursor-pointer">
                <div className="flex items-center gap-2 relative">
                  {/* Nút thêm emoji */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-blue-500 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9.172 9.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  {/* Emoji picker hiển thị ngay dưới nút */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-1 z-50">
                      <EmojiPicker onEmojiClick={(emojiData: EmojiClickData) => setCommentText((prev) => prev + emojiData.emoji)} />
                    </div>
                  )}

                  {/* Nút thêm ảnh */}
                  <label
                    htmlFor={`file-input-${id}`}
                    className="cursor-pointer flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-500 hover:text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5zm0 0l5.25-5.25a.75.75 0 011.06 0L15 16.5m0 0l2.25-2.25a.75.75 0 011.06 0L21 16.5"
                      />
                    </svg>
                  </label>
                </div>
              </label>
              <input
                id={`file-input-${id}`}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {commentImage && (
              <div className="flex items-center space-x-2 mx-6">
                <img
                  src={commentImage}
                  alt="Preview"
                  className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Comment list */}
          {commentList.map((cmt) => (
            <div key={cmt.id} className="flex items-start space-x-2 mb-2">
              <img src={cmt.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm max-w-[80%]">
                <p className="font-semibold text-black">{cmt.name}</p>
                <p>{cmt.text}</p>

                {cmt.image && (
                  <img
                    src={cmt.image}
                    alt="comment"
                    className="mt-2 max-w-[400px] max-h-[400px] rounded-md"
                  />
                )}

                {/* Thời gian + Hành động */}
                <div className="text-xs text-gray-500 mt-1 flex space-x-3 items-center">
                  <span>{cmt.timestamp}</span>
                  <button className="hover:underline cursor-pointer" onClick={() => onLikeComment(id, cmt.id)}>Thích</button>
                  <div className="flex items-center space-x-1">
                    <span role="img" aria-label="like">👍</span>
                    <span>{cmt.likeCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component: Middle
const Middle = () => {
  const currentUser = {
    id: 1,
    name: "Nguyen Van A",
    avatar: "/images/avatar.png",
  };

  const users = [
    currentUser,
    {
      id: 2,
      name: "Cửu Linh Nguyên Thánh",
      avatar: "/images/avatar2.jpg",
    },
    {
      id: 3,
      name: "Doãn Đại Hiệp",
      avatar: "/images/avatar3.webp",
    },
  ];

  const [posts, setPosts] = useState<Post[]>([
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
      commentList: [],
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
      commentList: [],
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
      commentList: [],
    },
  ]);

  const handleLikeComment = (postId: number, commentId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentList: post.commentList.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likeCount: comment.likeCount ? comment.likeCount + 1 : 1,
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };

  const handleLike = (id: number, newLikes: number, newIsLiked: boolean) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: newLikes, isLiked: newIsLiked } : post
      )
    );
  };

  const handleAddComment = (postId: number, text: string, image?: string) => {
    const newComment = {
      id: Date.now(),
      name: currentUser.name,
      avatar: currentUser.avatar,
      text,
      image,
      timestamp: "Just now",
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentList: [...post.commentList, newComment],
              comments: post.comments + 1,
            }
          : post
      )
    );
  };

  return (
    <>
      <YoursMind />
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
            commentList={post.commentList}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        );
      })}
    </>
  );
};

export default Middle;

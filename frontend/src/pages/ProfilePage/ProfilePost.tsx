import { HandThumbUpIcon, ChatBubbleOvalLeftIcon, ShareIcon, EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import PostModal from "./PostModal";

interface CommentType {
  id: number;
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
  isLiked: boolean;
  likeCount: number;
  commentList: CommentType[];
  image?: string;
}

interface PostType {
  id: number;
  name: string;
  avatar: string;
  timestamp: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  commentList: CommentType[];
}

const ProfilePost = () => {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 1,
      name: "Tên người dùng",
      avatar: "/images/dp5.png",
      timestamp: "2 giờ trước",
      content: "Hôm nay là một ngày đẹp trời!",
      image: "/images/pic1.jpeg",
      likes: 12,
      comments: 5,
      shares: 2,
      isLiked: false,
      commentList: [],
    },
    {
      id: 2,
      name: "Lac",
      avatar: "/images/avatar.png",
      timestamp: "4 giờ trước",
      content: "Cảnh này thật tuyệt vời!",
      image: "/images/pic2.jpeg",
      likes: 30,
      comments: 10,
      shares: 4,
      isLiked: true,
      commentList: [],
    },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const handleLikeComment = useCallback(
    (postId: number, commentId: number) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentList: post.commentList.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        isLiked: !comment.isLiked,
                        likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
                      }
                    : comment
                ),
              }
            : post
        )
      );
    },
    []
  );

  // Tối ưu hóa hàm handleLike bằng useCallback
  const handleLike = useCallback(
    (id: number) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    },
    []
  );
  
  const addPost = useCallback(
    (content: string, image: string | null) => {
      const newPost: PostType = {
        id: Date.now(),
        name: "Tên người dùng",
        avatar: "/images/dp5.png",
        timestamp: "Vừa xong",
        content,
        image,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        commentList: [],
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  const handleAddComment = (postId: number, text: string, image?: string | null) => {
    const newComment: CommentType = {
      id: Date.now(),
      name: "Tên người dùng",
      avatar: "/images/dp5.png",
      text,
      isLiked: false,
      likeCount: 0,
      commentList: [],
      timestamp: "Vừa xong",
      image: image || undefined,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentList: [...post.commentList, newComment],
            }
          : post
      )
    );
  };

  return (
    <div className="mt-4">
      {/* Modal tạo bài viết */}
      <PostModal isOpen={showModal} onClose={() => setShowModal(false)} onPost={addPost} />

      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onLike={handleLike}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      ))}

    </div>
  );
};

const Post = ({
  post,
  onLike,
  onAddComment,
  onLikeComment,
}: {
  post: PostType;
  onLike: (id: number) => void;
  onAddComment: (postId: number, text: string, image?: string | null) => void;
  onLikeComment: (postId: number, commentId: number) => void;
}) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setCommentText((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
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
  } = post;

  return (
    <div className="rounded-md bg-white shadow-md mb-4">
      <div className="flex justify-between items-center p-3">
        {/* Bên trái: Avatar và tên, timestamp */}
        <div className="flex items-center">
          <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
          <div>
            <p className="text-black font-semibold">{name}</p>
            <p className="text-gray-500 text-xs">{timestamp}</p>
          </div>
        </div>

        {/* Bên phải: Icon button */}
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:bg-gray-200 rounded-full p-1">
            <EllipsisHorizontalIcon className="h-6 w-6" />
          </button>
          <button className="text-gray-500 hover:bg-gray-200 rounded-full p-1">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="px-2">
        <p className="text-black mb-3">{content}</p>
        {image && (
          <div className="flex justify-center">
            <img
              src={image}
              alt="Post Image"
              className="max-w-[500px] max-h-[500px] w-auto h-auto object-contain rounded-md mx-auto"
            />
          </div>
        )}
      </div>
      <div className="px-3 pb-3">
        <div className="flex justify-between text-gray-500 text-sm py-2">
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">👍</span>
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <span>{comments} comments</span>
            <span>{shares} shares</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <button
            onClick={() => onLike(id)}
            className={`flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 ${
              isLiked ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <HandThumbUpIcon className="h-5 w-5" />
            <span>Like</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-500">
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
              <img src="/images/dp5.png" alt="avatar" className="w-8 h-8 rounded-full mr-2" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (commentText.trim() !== "" || commentImage)) {
                    onAddComment(post.id, commentText.trim(), commentImage);
                    setCommentText("");
                    setCommentImage(null);
                  }
                }}
                placeholder="Viết bình luận..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 pr-10 text-base focus:outline-none"
              />
              {/* Icon thêm ảnh nằm trong input */}
              <label htmlFor={`file-input-${post.id}`} className="absolute right-3 cursor-pointer">
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
                    htmlFor={`file-input-${post.id}`}
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
                id={`file-input-${post.id}`}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex items-center space-x-2 mx-6">
              {commentImage && (
                <img
                  src={commentImage}
                  alt="Preview"
                  className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                />
              )}
            </div>
          </div>

          {/* Danh sách comment */}
          {post.commentList.map((cmt) => (
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
                  <button className="hover:underline cursor-pointer" onClick={() => onLikeComment(post.id, cmt.id)}>Thích</button>
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

export default ProfilePost;

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

import {
  User,
  PostType,
  HeaderPostProps,
  PostProps,
} from "../../../type/type.ts";

// What's on your mind
const YoursMind = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Giả định thông tin người dùng từ context hoặc API
  const user: User = {
    id: 1,
    email: "",
    name: "Nguyen Van A",
    avatarUrl: "/images/avatar.png",
  };

  const handlePhotoVideoClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col shadow-md mb-4 bg-white p-4 rounded-md space-y-2">
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <img
          src="/images/avatar.png"
          alt=""
          className="rounded-full w-10 h-10"
        />
        <input
          type="text"
          placeholder="What's on your mind, ... ?"
          className="bg-gray-100 w-full px-2 rounded-2xl"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="flex">
        <div className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md">
          <img src="/images/live_video.png" alt="" className="size-7" />
          <label>Live video</label>
        </div>
        <button
          onClick={handlePhotoVideoClick}
          className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md"
        >
          <img src="/images/photo_video.png" alt="" className="size-7" />
          <label>Photo/video</label>
        </button>
        <div className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md">
          <img src="/images/feeling_activity.png" alt="" className="size-7" />
          <label>Feeling/activity</label>
        </div>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </div>
  );
};

const CreatePostModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("public");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // Giới hạn 10MB
        alert("File too large. Maximum size is 10MB.");
        return;
      }
      setMedia(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Content is required.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("status", status);
      if (media) {
        if (media.type.startsWith("image/")) {
          formData.append("imageFile", media);
        } else if (media.type.startsWith("video/")) {
          formData.append("videoFile", media);
        }
      }

      console.log("FormData:", {
        content,
        status,
        imageFile: media?.type.startsWith("image/") ? media.name : null,
        videoFile: media?.type.startsWith("video/") ? media.name : null,
      });

      const response = await fetch(
        "http://localhost:8080/api/posts/createPost",
        {
          method: "POST",
          body: formData,
          headers: {
            // Nếu cần token: "Authorization": `Bearer ${yourToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", response.status, errorText);
        throw new Error(
          `Failed to create post: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Post created:", result);
      setContent("");
      setMedia(null);
      setPreviewUrl(null);
      setStatus("public");
      onClose();
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(`Failed to create post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <img
              src={user.avatarUrl || "/images/avatar.png"}
              alt={user.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <span className="font-semibold">{user.name}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-24 p-2 border border-gray-300 rounded-md resize-none"
              required
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="private">Private</option>
            </select>
            {previewUrl && (
              <div className="relative mt-4">
                {media?.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 w-full object-contain rounded-md"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-64 w-full object-contain rounded-md"
                  />
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="mt-4"
              hidden
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full bg-gray-100 p-2 rounded-md flex items-center justify-center space-x-2"
            >
              <img src="/images/photo_video.png" alt="" className="size-6" />
              <span>Add Photo/Video</span>
            </button>
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className={`mt-4 w-full bg-blue-500 text-white p-2 rounded-md ${
                isLoading || !content.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Stories
const Stories = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const storiesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    checkScroll();
    const storiesElement = storiesRef.current;
    storiesElement?.addEventListener("scroll", checkScroll);
    return () => storiesElement?.removeEventListener("scroll", checkScroll);
  }, []);

  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const storyWidth = 144;
  const gap = 16;
  const storiesPerView = 3;
  const scrollDistance =
    storiesPerView * storyWidth + (storiesPerView - 1) * gap;

  const scrollLeft = () => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({
        left: -scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mb-4">
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
      )}
      <div
        ref={storiesRef}
        className="flex flex-row gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center"
          >
            Story {index + 1}
          </div>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      )}
    </div>
  );
};

// Header của Post
const HeaderPost = ({ name, avatar, timestamp, status }: HeaderPostProps) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={avatar || "/images/avatar.png"}
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
            {status && (
              <>
                <span>·</span>
                <span>{status}</span>
                <GlobeAltIcon className="h-4 w-4" />
              </>
            )}
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

// Post component
const Post = ({
  id,
  name,
  avatar,
  timestamp,
  content,
  imageUrl,
  imageContentType,
  likesCount,
  commentsCount,
  sharesCount,
  isLiked,
  onLike,
  currentUserId,
}: PostProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Hàm chuyển Base64 thành URL dữ liệu
  const getImageSrc = () => {
    if (!imageUrl) return undefined;
    // Nếu imageUrl đã là data URL hoàn chỉnh
    if (imageUrl.startsWith("data:image/")) {
      return imageUrl;
    }
    // Nếu imageUrl là Base64 thô, thêm prefix
    const mimeType = imageContentType || "image/jpeg"; // Mặc định jpeg nếu không có
    return `data:${mimeType};base64,${imageUrl}`;
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/likes", {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token: "Authorization": `Bearer ${yourToken}`,
        },
        body: JSON.stringify({ userId: currentUserId, postId: id }),
      });
      if (!response.ok) throw new Error("Failed to update like");

      const countResponse = await fetch(
        `http://localhost:8080/api/likes/post/${id}/count`
      );
      if (!countResponse.ok) throw new Error("Failed to fetch likes count");
      const { value: newLikes } = await countResponse.json(); // Sửa để khớp với { key: "likesCount", value: number }

      onLike(id, newLikes, !isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-md bg-white shadow-md mb-4">
      <HeaderPost
        name={name}
        avatar={avatar}
        timestamp={timestamp}
        status={undefined}
      />
      <div className="px-2">
        {content && <p className="text-black mb-3">{content}</p>}
        {imageUrl && (
          <div className="flex justify-center">
            <img
              src={getImageSrc()}
              alt="Post Image"
              className="max-w-[500px] max-h-[500px] w-full h-auto object-contain rounded-md"
              onError={(e) => {
                console.error("Error loading image:", imageUrl);
                e.currentTarget.style.display = "none"; // Ẩn ảnh nếu lỗi
              }}
            />
          </div>
        )}
      </div>
      <div className="px-3 pb-3 border-t border-gray-200">
        <div className="flex justify-between text-gray-500 text-sm py-2">
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">😂</span>
            <span>{likesCount.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <span>{commentsCount} comments</span>
            <span>{sharesCount} shares</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 ${
              isLiked ? "text-blue-500" : "text-gray-500"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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

// Middle component
const Middle = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const currentUserId = 1; // Giả định ID người dùng hiện tại, thay bằng logic xác thực thực tế

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/posts/getAllPosts"
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();

        const formattedPosts: PostType[] = await Promise.all(
          data.map(async (post: any) => {
            const likeStatusResponse = await fetch(
              `http://localhost:8080/api/likes/post/${post.id}/status?userId=${currentUserId}`
            );
            const { value: isLiked } = likeStatusResponse.ok
              ? await likeStatusResponse.json()
              : { value: false };

            const likesCountResponse = await fetch(
              `http://localhost:8080/api/likes/post/${post.id}/count`
            );
            const { value: likesCount } = likesCountResponse.ok
              ? await likesCountResponse.json()
              : { value: 0 };

            return {
              id: post.id,
              content: post.content,
              createdAt: post.createdAt,
              imageUrl: post.imageUrl,
              imageContentType: post.imageContentType,
              user: {
                id: post.user.id,
                name: post.user.name,
                email: post.user.email,
                avatarUrl: post.user.avatarUrl,
              },
              status: post.status,
              videoUrl: post.videoUrl,
              likesCount,
              commentsCount: 0, // Cần API để lấy comments
              sharesCount: 0, // Cần API để lấy shares
              isLiked,
            };
          })
        );

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = (id: number, newLikes: number, newIsLiked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, likesCount: newLikes, isLiked: newIsLiked }
          : post
      )
    );
  };

  return (
    <>
      <YoursMind />
      <Stories />
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          name={post.user.name}
          avatar={post.user.avatarUrl}
          timestamp={new Date(post.createdAt).toLocaleString("vi-VN", {
            dateStyle: "short",
            timeStyle: "short",
          })}
          content={post.content}
          imageUrl={post.imageUrl}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          sharesCount={post.sharesCount}
          isLiked={post.isLiked}
          onLike={handleLike}
          currentUserId={currentUserId}
        />
      ))}
    </>
  );
};

export default Middle;

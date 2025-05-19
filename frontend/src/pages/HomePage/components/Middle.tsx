import { useEffect, useRef, useState } from "react";
import {
  ChatBubbleOvalLeftIcon,
  HandThumbUpIcon,
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
  PostModalProps,
  CommentType,
  CommentProps,
  YoursMindProps,
} from "../../../type/type.ts";

// What's on your mind
const YoursMind = ({ currentUser }: YoursMindProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostProps[]>([]);

  const handlePhotoVideoClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col shadow-md mb-4 bg-white p-4 rounded-md space-y-2">
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <img
          src={currentUser.avatarUrl || "/images/avatar.png"}
          alt={currentUser.name}
          className="rounded-full w-10 h-10"
        />
        <input
          type="text"
          placeholder={`What's on your mind, ${currentUser.name}?`}
          className="bg-gray-100 w-full px-2 rounded-2xl"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="flex">
        <button
          onClick={handlePhotoVideoClick}
          className="flex flex-1 space-x-2 items-center justify-center hover:bg-gray-200 rounded-md"
        >
          <img src="/images/photo_video.png" alt="" className="size-7" />
          <label>Photo/video</label>
        </button>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostAdded={(newPost: PostProps) => setPosts([newPost, ...posts])}
        currentUser={currentUser}
      />
    </div>
  );
};

//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);

//   const storiesRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     checkScroll();
//     const storiesElement = storiesRef.current;
//     storiesElement?.addEventListener("scroll", checkScroll);
//     return () => storiesElement?.removeEventListener("scroll", checkScroll);
//   }, []);

//   const checkScroll = () => {
//     if (storiesRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
//       setCanScrollLeft(scrollLeft > 0);
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
//     }
//   };

//   const storyWidth = 144;
//   const gap = 16;
//   const storiesPerView = 3;
//   const scrollDistance =
//     storiesPerView * storyWidth + (storiesPerView - 1) * gap;

//   const scrollLeft = () => {
//     if (storiesRef.current) {
//       storiesRef.current.scrollBy({
//         left: -scrollDistance,
//         behavior: "smooth",
//       });
//     }
//   };

//   const scrollRight = () => {
//     if (storiesRef.current) {
//       storiesRef.current.scrollBy({
//         left: scrollDistance,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="relative mb-4">
//       {canScrollLeft && (
//         <button
//           onClick={scrollLeft}
//           className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
//         >
//           <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
//         </button>
//       )}
//       <div
//         ref={storiesRef}
//         className="flex flex-row gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
//       >
//         {Array.from({ length: 12 }).map((_, index) => (
//           <div
//             key={index}
//             className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center"
//           >
//             Story {index + 1}
//           </div>
//         ))}
//       </div>
//       {canScrollRight && (
//         <button
//           onClick={scrollRight}
//           className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
//         >
//           <ChevronRightIcon className="h-6 w-6 text-gray-800" />
//         </button>
//       )}
//     </div>
//   );
// };

// Header của Post
const CreatePostModal = ({
  isOpen,
  onClose,
  onPostAdded,
  currentUser,
}: PostModalProps) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
  const [status, setStatus] = useState("PUBLIC");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hardcode danh sách video
  // const videos = ["video1.mp4", "video2.mp4"];
  const videoFiles = import.meta.glob("/public/videos/*.{mp4,webm,ogg}", {
    as: "url",
    eager: true,
  });
  const videos = Object.keys(videoFiles).map((path) =>
    path.replace("/public/videos/", "")
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh (JPEG, PNG, GIF)");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setSelectedVideoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile && !selectedVideoUrl) {
      alert("Vui lòng nhập nội dung, chọn ảnh hoặc video");
      return;
    }
    if (!currentUser || !currentUser.id) {
      alert("Bạn chưa đăng nhập hoặc thiếu ID người dùng");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("status", status);
      formData.append("userId", currentUser.id.toString());
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      if (selectedVideoUrl) {
        formData.append("videoUrl", selectedVideoUrl); // Gửi tên file
      }

      console.log("FormData:", {
        content,
        status,
        userId: currentUser.id,
        imageFile: imageFile?.name,
        videoUrl: selectedVideoUrl,
      });

      const response = await fetch(
        "http://localhost:8080/api/posts/create-post",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create post: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      // Chuyển đổi result thành PostProps
      const newPost: PostProps = {
        id: result.id,
        name: result.user.name,
        avatar: result.user.avatarUrl,
        timestamp: result.createdAt,
        content: result.content,
        imageUrl: result.imageUrl,
        imageContentType: result.imageContentType,
        videoUrl: result.videoUrl,
        likesCount: result.likes?.length || 0,
        commentsCount: result.comments?.length || 0,
        isLiked: false, // Giả sử mặc định chưa like
        onLike: () => {}, // Placeholder, sẽ được gán bởi parent
        onCommentAdded: () => {}, // Placeholder
        currentUser,
      };

      setContent("");
      setImageFile(null);
      setPreviewUrl(null);
      setSelectedVideoUrl("");
      setStatus("PUBLIC");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onPostAdded(newPost);
      onClose();
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(`Lỗi khi đăng bài: ${error.message}`);
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
              src={currentUser?.avatarUrl || "/images/avatar.png"}
              alt={currentUser?.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <span className="font-semibold">{currentUser?.name}</span>
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
              <option value="PUBLIC">Public</option>
              <option value="FRIENDS">Friends</option>
              <option value="PRIVATE">Private</option>
            </select>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
                id="imageInput"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-100 p-2 rounded-md flex items-center justify-center space-x-2"
              >
                <img src="/images/photo.png" alt="" className="size-6" />
                <span>Add Photo</span>
              </button>
              <select
                value={selectedVideoUrl}
                onChange={(e) => setSelectedVideoUrl(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Video</option>
                {videos.map((video) => (
                  <option key={video} value={video}>
                    {video}
                  </option>
                ))}
              </select>
            </div>
            {(previewUrl || selectedVideoUrl) && (
              <div className="relative mt-4">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 w-full object-contain rounded-md"
                  />
                )}
                {selectedVideoUrl && (
                  <video
                    src={`/videos/${selectedVideoUrl}`}
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
            <button
              type="submit"
              disabled={
                isLoading ||
                (!content.trim() && !imageFile && !selectedVideoUrl)
              }
              className={`mt-4 w-full bg-blue-500 text-white p-2 rounded-md ${
                isLoading ||
                (!content.trim() && !imageFile && !selectedVideoUrl)
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
  videoUrl,
  commentsCount,
  isLiked,
  onLike,
  onCommentAdded,
  currentUser,
}: PostProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách comment
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/post/${id}`,
        {
          headers: {
            // Authorization: `Bearer ${localStorage.getItem("token")}`, // Đã comment vì không dùng token
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      const mappedComments: CommentType[] = data.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatarUrl: comment.user.avatarUrl,
        },
        post: { id: comment.post.id }, // Map post.id
      }));
      setComments(mappedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Thêm comment mới
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          postId: id, // Gửi postId trực tiếp
          userId: currentUser.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to add comment: ${response.status} - ${errorText}`
        );
      }

      const countResponse = await fetch(
        `http://localhost:8080/api/comments/post/${id}/count`
      );
      if (!countResponse.ok) {
        const errorText = await countResponse.text();
        throw new Error(
          `Failed to fetch comments count: ${countResponse.status} - ${errorText}`
        );
      }
      const { value: newCommentsCount } = await countResponse.json();

      // Thêm comment mới vào danh sách
      const newCommentObj: CommentType = {
        id: Date.now(), // ID tạm, nên lấy từ response nếu backend trả về
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl,
        },
        post: { id }, // Điều chỉnh để khớp với CommentType nếu cần
      };

      setComments([...comments, newCommentObj]);
      setNewComment("");
      onCommentAdded(id, newCommentsCount);
    } catch (error: any) {
      console.error("Error adding comment:", error);
      alert(`Failed to add comment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // Xử lý click nút Like
  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/likes", {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: currentUser.id, postId: id }),
      });
      if (!response.ok) throw new Error("Failed to update like");

      const countResponse = await fetch(
        `http://localhost:8080/api/likes/post/${id}/count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!countResponse.ok) throw new Error("Failed to fetch likes count");
      const { value: newLikes } = await countResponse.json();

      onLike(id, newLikes, !isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý click nút Comment
  const handleCommentClick = () => {
    setShowComments((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => commentInputRef.current?.focus(), 0);
        fetchComments();
      } else {
        setNewComment("");
        fetchComments();
      }
      return newState;
    });
  };

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
        {imageUrl ? (
          <div className="flex justify-center">
            <img
              src={getImageSrc()}
              alt="Post Image"
              className="max-w-[500px] max-h-[500px] w-full h-auto object-contain rounded-md"
              loading="lazy"
              onError={(e) => {
                console.error("Error loading image:", imageUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : videoUrl ? (
          <div className="flex justify-center">
            <video
              src={`${videoUrl}`}
              controls
              className="max-w-[500px] max-h-[500px] w-full h-auto object-contain rounded-md"
              onError={(e) => {
                console.error("Error loading video:", videoUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="px-3 pb-3 border-t border-gray-200">
        <div className="flex justify-between text-gray-500 text-sm py-2">
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">😂</span>
            <span>{likesCount.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <span>{commentsCount} comments</span>
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
          <button
            onClick={handleCommentClick}
            className="flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <ChatBubbleOvalLeftIcon className="h-5 w-5" />
            <span>Comment</span>
          </button>
        </div>
        {showComments && (
          <div className="mt-2 border-t border-gray-200 pt-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
            <form onSubmit={handleAddComment} className="flex space-x-2 mt-2">
              <img
                src={currentUser.avatarUrl || "/images/avatar.png"}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full"
              />
              <input
                ref={commentInputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className={`text-blue-500 font-semibold ${
                  isLoading || !newComment.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Component Comment
const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex space-x-2 mt-2">
      <img
        src={comment.user.avatarUrl || "/images/avatar.png"}
        alt={comment.user.name}
        className="h-8 w-8 rounded-full"
      />
      <div className="flex-1 bg-gray-100 rounded-lg p-2">
        <div className="flex justify-between">
          <span className="font-semibold text-sm">{comment.user.name}</span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

// Middle component
const Middle = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Lấy user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        console.log("Parsed currentUser:", parsedUser); // Debug
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("currentUser"); // Xóa nếu dữ liệu lỗi
      }
    }
  }, []);

  // Lấy danh sách bài viết
  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser) return; // Chờ currentUser được set
      try {
        const response = await fetch(
          "http://localhost:8080/api/posts/get-all-posts",
          {
            headers: {
              // Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();

        const formattedPosts: PostType[] = await Promise.all(
          data.map(async (post: any) => {
            const likeStatusResponse = await fetch(
              `http://localhost:8080/api/likes/post/${post.id}/status?userId=${currentUser.id}`,
              {
                headers: {
                  // Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const { value: isLiked } = likeStatusResponse.ok
              ? await likeStatusResponse.json()
              : { value: false };

            const likesCountResponse = await fetch(
              `http://localhost:8080/api/likes/post/${post.id}/count`,
              {
                headers: {
                  // Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const { value: likesCount } = likesCountResponse.ok
              ? await likesCountResponse.json()
              : { value: 0 };

            const commentsCountResponse = await fetch(
              `http://localhost:8080/api/comments/post/${post.id}/count`,
              {
                headers: {
                  // Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const { value: commentsCount } = commentsCountResponse.ok
              ? await commentsCountResponse.json()
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
              videoUrl: "/public/videos/" + post.videoUrl,
              likesCount,
              commentsCount,
              isLiked,
            };
          })
        );

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleLike = (id: number, newLikes: number, newIsLiked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, likesCount: newLikes, isLiked: newIsLiked }
          : post
      )
    );
  };

  const handleCommentAdded = (id: number, newCommentsCount: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, commentsCount: newCommentsCount } : post
      )
    );
  };

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  return (
    <>
      {currentUser && <YoursMind currentUser={currentUser} />}
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
          videoUrl={post.videoUrl}
          content={post.content}
          imageUrl={post.imageUrl}
          imageContentType={post.imageContentType}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          isLiked={post.isLiked}
          onLike={handleLike}
          onCommentAdded={handleCommentAdded}
          currentUser={currentUser}
        />
      ))}
    </>
  );
};

export default Middle;

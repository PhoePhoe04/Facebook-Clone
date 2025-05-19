import { useState, useEffect, useRef } from "react";
import { PostProps, User, CommentType } from "../../type/type";
import {
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
  GlobeAltIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface HeaderPostProps {
  name: string;
  avatar?: string | null;
  timestamp: string;
  status?: string;
}

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

const Comment = ({ comment }: { comment: CommentType }) => {
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

const ProfilePost = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Bước 1: Lấy currentUser từ localStorage
      const userData = localStorage.getItem("currentUser");
      console.log("User data from localStorage:", userData); // Debug
      let user: User | null = null;
      if (userData) {
        try {
          user = JSON.parse(userData);
          console.log("Parsed currentUser:", user); // Debug
          setCurrentUser(user);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          localStorage.removeItem("currentUser");
          setError("Lỗi khi lấy thông tin người dùng");
          setIsLoading(false);
          return;
        }
      }

      // Bước 2: Nếu không có user, báo lỗi
      if (!user) {
        setError("Vui lòng đăng nhập để xem bài viết");
        setIsLoading(false);
        return;
      }

      // Bước 3: Fetch posts
      try {
        console.log("Fetching posts with userId:", user.id); // Debug
        const response = await fetch(
          `http://localhost:8080/api/posts/user/?userId=${user.id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();
        const fetchedPosts: PostProps[] = await Promise.all(
          data.map(async (post: any) => {
            // Lấy trạng thái like
            const likeStatusResponse = await fetch(
              `http://localhost:8080/api/likes/post/${post.id}/status?userId=${user.id}`
            );
            const { value: isLiked } = likeStatusResponse.ok
              ? await likeStatusResponse.json()
              : { value: false };

            // Lấy số likes
            const likesCountResponse = await fetch(
              `http://localhost:8080/api/likes/post/${post.id}/count`
            );
            const { value: likesCount } = likesCountResponse.ok
              ? await likesCountResponse.json()
              : { value: 0 };

            // Lấy số comments
            const commentsCountResponse = await fetch(
              `http://localhost:8080/api/comments/post/${post.id}/count`
            );
            const { value: commentsCount } = commentsCountResponse.ok
              ? await commentsCountResponse.json()
              : { value: 0 };

            return {
              id: post.id,
              name: post.user.name,
              avatar: post.user.avatarUrl || "/images/avatar.png",
              timestamp: new Date(post.createdAt).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              }),
              content: post.content || null,
              imageUrl: post.imageUrl || null,
              imageContentType: post.imageContentType || null,
              videoUrl: post.videoUrl
                ? `/public/videos/${post.videoUrl}`
                : null,
              likesCount,
              commentsCount,
              isLiked,
              onLike: (id: number, newLikes: number, newIsLiked: boolean) => {
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === id
                      ? { ...p, likesCount: newLikes, isLiked: newIsLiked }
                      : p
                  )
                );
              },
              onCommentAdded: (id: number, newCommentsCount: number) => {
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, commentsCount: newCommentsCount } : p
                  )
                );
              },
              currentUser: user,
              comments: [], // Comments sẽ được fetch khi nhấn nút Comment
            };
          })
        );

        setPosts(fetchedPosts);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Đang tải bài viết...</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} currentUser={currentUser!} />
      ))}
    </div>
  );
};

const Post = ({
  post,
  currentUser,
}: {
  post: PostProps;
  currentUser: User;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/post/${post.id}`
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
        post: { id: comment.post.id },
      }));
      setComments(mappedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/likes", {
        method: post.isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.id, postId: post.id }),
      });
      if (!response.ok) throw new Error("Failed to update like");

      const countResponse = await fetch(
        `http://localhost:8080/api/likes/post/${post.id}/count`
      );
      if (!countResponse.ok) throw new Error("Failed to fetch likes count");
      const { value: newLikes } = await countResponse.json();

      post.onLike(post.id, newLikes, !post.isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
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
          postId: post.id,
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
        `http://localhost:8080/api/comments/post/${post.id}/count`
      );
      if (!countResponse.ok) {
        throw new Error("Failed to fetch comments count");
      }
      const { value: newCommentsCount } = await countResponse.json();

      const newCommentObj: CommentType = {
        id: Date.now(), // ID tạm, lý tưởng nên lấy từ response
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl,
        },
        post: { id: post.id },
      };

      setComments([...comments, newCommentObj]);
      setNewComment("");
      post.onCommentAdded(post.id, newCommentsCount);
    } catch (err: any) {
      console.error("Error adding comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getImageSrc = () => {
    if (!post.imageUrl) return undefined;
    if (post.imageUrl.startsWith("data:image/")) {
      return post.imageUrl;
    }
    const mimeType = post.imageContentType || "image/jpeg";
    return `data:${mimeType};base64,${post.imageUrl}`;
  };

  return (
    <div className="rounded-md bg-white shadow-md mb-4">
      <HeaderPost
        name={post.name}
        avatar={post.avatar}
        timestamp={post.timestamp}
        status={undefined}
      />
      <div className="px-2">
        {post.content && <p className="text-black mb-3">{post.content}</p>}
        {post.imageUrl ? (
          <div className="flex justify-center">
            <img
              src={getImageSrc()}
              alt="Post Image"
              className="max-w-[500px] max-h-[500px] w-full h-auto object-contain rounded-md"
              loading="lazy"
              onError={(e) => {
                console.error("Error loading image:", post.imageUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : post.videoUrl ? (
          <div className="flex justify-center">
            <video
              src={post.videoUrl}
              controls
              className="max-w-[500px] max-h-[500px] w-full h-auto object-contain rounded-md"
              onError={(e) => {
                console.error("Error loading video:", post.videoUrl);
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
            <span>{post.likesCount.toLocaleString()}</span>
          </div>
          <div className="flex space-x-2">
            <span>{post.commentsCount} comments</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex flex-1 items-center justify-center space-x-1 px-4 py-2 rounded-md hover:bg-gray-100 ${
              post.isLiked ? "text-blue-500" : "text-gray-500"
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
            <form
              onSubmit={handleCommentSubmit}
              className="flex space-x-2 mt-2"
            >
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

export default ProfilePost;

// Interface cho User
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

// Interface cho Post
export interface PostType {
  id: number;
  content?: string | null;
  createdAt: string;
  imageUrl?: string | null;
  imageContentType?: string | null;
  user: User;
  status?: string | null;
  videoUrl?: string | null;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  commentList: CommentType[];
  isLiked: boolean;
}

// Interface cho props của HeaderPost
export interface HeaderPostProps {
  name: string;
  avatar?: string | null;
  timestamp: string;
  status?: string | null;
}

// Interface cho props của Post
export interface PostProps {
  id: number;
  name: string;
  avatar?: string | null;
  timestamp: string;
  content?: string | null;
  imageUrl?: string | null;
  imageContentType?: string | null;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  onLike: (id: number, newLikes: number, newIsLiked: boolean) => void;
  currentUserId: number;
}

export interface CommentType {
  id: number;
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
  isLiked: boolean;
  likeCount: number;
  commentList: CommentType[];
  image?: string | null;
}
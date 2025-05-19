// Interface cho User
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  avatarImage?: string | null;
  imageCover?: string | null;
  avatarContentType?: string | null;
  bio?: string | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
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
  isLiked: boolean;
  onLike: (id: number, newLikes: number, newIsLiked: boolean) => void;
  onCommentAdded: (id: number, newCommentsCount: number) => void;
  currentUser: User;
}

// Interface cho Comment
export interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string | null;
  };
  post: {
    id: number;
  };
}

// Interface cho props của Comment
export interface CommentProps {
  comment: CommentType;
}

// Interface cho props của YoursMind
export interface YoursMindProps {
  currentUser: User;
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
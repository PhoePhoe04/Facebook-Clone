import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { getComments, createComment, deleteComment } from '../../services/comment.service';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Send } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setNewComment('');
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      postId,
      content: newComment,
    });
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border-t">
      {/* Comment List */}
      <div className="p-4 space-y-4">
        {comments?.map((comment: any) => (
          <div key={comment.id} className="flex space-x-3">
            <img
              src={comment.author.profilePicture || '/default-avatar.png'}
              alt={`${comment.author.firstName}'s profile`}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="font-semibold">
                  {comment.author.firstName} {comment.author.lastName}
                </div>
                <p className="text-gray-800">{comment.content}</p>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <button className="hover:text-gray-700">Like</button>
                <button className="hover:text-gray-700">Reply</button>
                <span>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {user?.id === comment.author.id && (
                  <div className="relative group">
                    <button className="hover:text-gray-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <img
            src={user?.profilePicture || '/default-avatar.png'}
            alt="Your profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection; 
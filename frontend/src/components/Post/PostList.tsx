import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '../../services/post.service';
import PostCard from './PostCard';
import { useInView } from 'react-intersection-observer';

const PostList = () => {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => getPosts(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
            <div className="h-24 bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
        Error loading posts: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page) =>
        page.content.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
      
      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={ref} className="h-4" />

      {/* No more posts indicator */}
      {!hasNextPage && data?.pages[0].content.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more posts to load
        </div>
      )}

      {/* Empty state */}
      {data?.pages[0].content.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500">
            Be the first to share something with your friends!
          </p>
        </div>
      )}
    </div>
  );
};

export default PostList; 
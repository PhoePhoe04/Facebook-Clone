import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CreatePost from '../../components/Post/CreatePost';
import PostList from '../../components/Post/PostList';
import FriendSuggestions from '../../components/Friend/FriendSuggestions';
import Contacts from '../../components/Chat/Contacts';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </div>
              <nav className="space-y-2">
                <a href="/friends" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>Friends</span>
                </a>
                <a href="/saved" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  <span>Saved</span>
                </a>
                <a href="/groups" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span>Groups</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <img
                  src={user?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
                  What's on your mind, {user?.firstName}?
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:bg-gray-50 rounded-lg p-2">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Live Video</span>
                </button>
                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:bg-gray-50 rounded-lg p-2">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Photo/Video</span>
                </button>
                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:bg-gray-50 rounded-lg p-2">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Feeling/Activity</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            <PostList posts={posts} />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-6">
            <FriendSuggestions />
            <Contacts />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <CreatePost
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={(newPost) => {
            setPosts([newPost, ...posts]);
            setIsCreatePostOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default HomePage; 
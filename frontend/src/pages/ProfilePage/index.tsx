import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile } from '../../services/user.service';
import { getUserPosts } from '../../services/post.service';
import { getMutualFriends, getFriendshipStatus } from '../../services/friend.service';
import PostCard from '../../components/Post/PostCard';
import FriendshipButton from '../../components/Friend/FriendshipButton';
import { Camera, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends'>('posts');

  // Fetch user profile
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId as string),
    enabled: !!userId
  });

  // Fetch user posts
  const {
    data: posts,
    isLoading: isLoadingPosts,
    error: postsError
  } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => getUserPosts(userId as string),
    enabled: !!userId && activeTab === 'posts'
  });

  // Fetch mutual friends
  const {
    data: mutualFriends,
    isLoading: isLoadingMutual,
    error: mutualError
  } = useQuery({
    queryKey: ['mutualFriends', userId],
    queryFn: () => getMutualFriends(userId as string),
    enabled: !!userId && userId !== currentUser?.id
  });

  // Fetch friendship status
  const {
    data: friendshipStatus,
    isLoading: isLoadingFriendship
  } = useQuery({
    queryKey: ['friendshipStatus', userId],
    queryFn: () => getFriendshipStatus(userId as string),
    enabled: !!userId && userId !== currentUser?.id
  });

  if (isLoadingProfile) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
          <div className="flex items-end space-x-5">
            <div className="w-32 h-32 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-1/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Error loading profile
        </h2>
        <p className="mt-2 text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Cover Photo */}
      <div className="relative h-64 bg-gray-200">
        {profile?.coverPhoto ? (
          <img
            src={profile.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        )}
        {currentUser?.id === userId && (
          <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow text-sm font-medium hover:bg-gray-50">
            Edit Cover Photo
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
        <div className="flex items-end space-x-5">
          <div className="relative">
            <img
              src={profile?.profilePicture || '/default-avatar.png'}
              alt={profile?.firstName}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {currentUser?.id === userId && (
              <button className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="text-sm text-gray-500">
                  {mutualFriends?.length} mutual friends
                </p>
              </div>
              {currentUser?.id !== userId && !isLoadingFriendship && (
                <FriendshipButton
                  userId={userId as string}
                  initialStatus={friendshipStatus?.status}
                />
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'friends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Friends
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {isLoadingPosts ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/6" />
                          </div>
                        </div>
                        <div className="mt-4 h-24 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                posts?.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>Lives in {profile?.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span>Works at {profile?.workplace || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <span>Studied at {profile?.education || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <span>{profile?.relationshipStatus || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {profile?.friends?.map((friend: any) => (
                <div key={friend.id} className="text-center">
                  <img
                    src={friend.profilePicture || '/default-avatar.png'}
                    alt={friend.firstName}
                    className="w-full aspect-square rounded-lg object-cover mb-2"
                  />
                  <h4 className="font-medium text-gray-900">
                    {friend.firstName} {friend.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {friend.mutualFriends} mutual friends
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
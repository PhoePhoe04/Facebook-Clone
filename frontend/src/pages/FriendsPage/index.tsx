import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend
} from '../../services/friend.service';
import { UserMinus, UserPlus, UserX } from 'lucide-react';

const FriendsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');

  const {
    data: friends,
    isLoading: isLoadingFriends,
    refetch: refetchFriends
  } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: () => getFriends(user?.id),
    enabled: !!user?.id
  });

  const {
    data: friendRequests,
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
    enabled: activeTab === 'requests'
  });

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      refetchRequests();
      refetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      refetchRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleUnfriend = async (userId: string) => {
    if (window.confirm('Are you sure you want to unfriend this person?')) {
      try {
        await unfriend(userId);
        refetchFriends();
      } catch (error) {
        console.error('Error unfriending user:', error);
      }
    }
  };

  const renderFriendsList = () => {
    if (isLoadingFriends) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!friends?.length) {
      return (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No friends yet
          </h3>
          <p className="text-gray-500">
            Start adding friends to connect with people you know.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friends.map((friend: any) => (
          <div key={friend.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img
                src={friend.profilePicture || '/default-avatar.png'}
                alt={`${friend.firstName}'s profile`}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {friend.firstName} {friend.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {friend.mutualFriends} mutual friends
                </p>
              </div>
              <button
                onClick={() => handleUnfriend(friend.id)}
                className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md"
                title="Unfriend"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFriendRequests = () => {
    if (isLoadingRequests) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!friendRequests?.length) {
      return (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No friend requests
          </h3>
          <p className="text-gray-500">
            When someone sends you a friend request, you'll see it here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {friendRequests.map((request: any) => (
          <div key={request.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img
                src={request.sender.profilePicture || '/default-avatar.png'}
                alt={`${request.sender.firstName}'s profile`}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {request.sender.firstName} {request.sender.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {request.mutualFriends} mutual friends
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <UserX className="w-5 h-5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Friends
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Friend Requests
          </button>
        </div>
      </div>

      {activeTab === 'all' ? renderFriendsList() : renderFriendRequests()}
    </div>
  );
};

export default FriendsPage; 
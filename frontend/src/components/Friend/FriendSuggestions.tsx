import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFriendSuggestions, sendFriendRequest } from '../../services/friend.service';
import { UserPlus } from 'lucide-react';

const FriendSuggestions = () => {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['friendSuggestions'],
    queryFn: getFriendSuggestions
  });

  const handleAddFriend = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      // Invalidate friend suggestions query to update UI
      // This will be handled by the queryClient in the parent component
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">People You May Know</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!suggestions?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">People You May Know</h3>
      <div className="space-y-4">
        {suggestions.map((user: any) => (
          <div key={user.id} className="flex items-center space-x-3">
            <img
              src={user.profilePicture || '/default-avatar.png'}
              alt={`${user.firstName}'s profile`}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h4 className="font-medium">
                {user.firstName} {user.lastName}
              </h4>
              <p className="text-sm text-gray-500">
                {user.mutualFriends} mutual friends
              </p>
            </div>
            <button
              onClick={() => handleAddFriend(user.id)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions; 
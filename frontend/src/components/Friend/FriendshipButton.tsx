import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  cancelFriendRequest
} from '../../services/friend.service';
import { UserPlus, UserCheck, UserX, UserMinus, Loader2 } from 'lucide-react';

interface FriendshipButtonProps {
  userId: string;
  initialStatus: 'none' | 'pending_sent' | 'pending_received' | 'friends';
}

const FriendshipButton: React.FC<FriendshipButtonProps> = ({
  userId,
  initialStatus
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateQueries = () => {
    queryClient.invalidateQueries(['friendshipStatus', userId]);
    queryClient.invalidateQueries(['mutualFriends']);
    queryClient.invalidateQueries(['friends']);
    queryClient.invalidateQueries(['friendRequests']);
  };

  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      setStatus('pending_sent');
      updateQueries();
    }
  });

  const acceptRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      setStatus('friends');
      updateQueries();
    }
  });

  const rejectRequestMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      setStatus('none');
      updateQueries();
    }
  });

  const unfriendMutation = useMutation({
    mutationFn: unfriend,
    onSuccess: () => {
      setStatus('none');
      updateQueries();
    }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      setStatus('none');
      updateQueries();
    }
  });

  const handleAddFriend = () => {
    sendRequestMutation.mutate(userId);
  };

  const handleAcceptRequest = () => {
    acceptRequestMutation.mutate(userId);
  };

  const handleRejectRequest = () => {
    rejectRequestMutation.mutate(userId);
  };

  const handleUnfriend = () => {
    if (window.confirm('Are you sure you want to unfriend this person?')) {
      unfriendMutation.mutate(userId);
    }
  };

  const handleCancelRequest = () => {
    cancelRequestMutation.mutate(userId);
  };

  const isLoading =
    sendRequestMutation.isPending ||
    acceptRequestMutation.isPending ||
    rejectRequestMutation.isPending ||
    unfriendMutation.isPending ||
    cancelRequestMutation.isPending;

  if (isLoading) {
    return (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
      >
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading...
      </button>
    );
  }

  switch (status) {
    case 'none':
      return (
        <button
          onClick={handleAddFriend}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Friend
        </button>
      );

    case 'pending_sent':
      return (
        <button
          onClick={handleCancelRequest}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          <UserX className="w-5 h-5 mr-2" />
          Cancel Request
        </button>
      );

    case 'pending_received':
      return (
        <div className="flex space-x-2">
          <button
            onClick={handleAcceptRequest}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Accept
          </button>
          <button
            onClick={handleRejectRequest}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <UserX className="w-5 h-5 mr-2" />
            Reject
          </button>
        </div>
      );

    case 'friends':
      return (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Friends
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={handleUnfriend}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Unfriend
              </button>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default FriendshipButton; 
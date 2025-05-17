import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers, updateUserRole, deleteUser } from '../../services/admin.service';
import { getAllPosts, deletePost } from '../../services/post.service';
import {
  Users,
  FileText,
  Trash2,
  Shield,
  ShieldOff,
  Search,
  AlertCircle
} from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Users Query
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError
  } = useQuery({
    queryKey: ['admin-users', searchQuery],
    queryFn: () => getAllUsers(searchQuery),
    enabled: activeTab === 'users'
  });

  // Posts Query
  const {
    data: posts,
    isLoading: isLoadingPosts,
    error: postsError
  } = useQuery({
    queryKey: ['admin-posts', searchQuery],
    queryFn: () => getAllPosts(searchQuery),
    enabled: activeTab === 'posts'
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
    }
  });

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === 'users'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === 'posts'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Posts
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.map((user: any) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={user.profilePicture || '/default-avatar.png'}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'ADMIN'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() =>
                                handleUpdateRole(
                                  user.id,
                                  user.role === 'ADMIN' ? 'USER' : 'ADMIN'
                                )
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {user.role === 'ADMIN' ? (
                                <ShieldOff className="w-5 h-5" />
                              ) : (
                                <Shield className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts?.map((post: any) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.author.profilePicture || '/default-avatar.png'}
                            alt={post.author.firstName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {post.author.firstName} {post.author.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-900">{post.content}</p>
                        {post.media && post.media.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {post.media.map((media: string, index: number) => (
                              <div key={index}>
                                {media.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                  <img
                                    src={media}
                                    alt={`Post media ${index + 1}`}
                                    className="rounded-lg"
                                  />
                                ) : (
                                  <video
                                    src={media}
                                    controls
                                    className="rounded-lg"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span>{post.likes} likes</span>
                        <span className="mx-2">•</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 
import React, { useState } from 'react';
import { Users, Plus, Settings, Search, Bell, MoreHorizontal } from 'lucide-react';

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState<'yourgroups' | 'discover' | 'create'>('yourgroups');

  const groups = [
    {
      id: 1,
      name: 'React Developers',
      members: '15K members',
      privacy: 'Public',
      thumbnail: '/group-thumb-1.jpg',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Travel Photography',
      members: '8K members',
      privacy: 'Private',
      thumbnail: '/group-thumb-2.jpg',
      lastActive: '5 minutes ago'
    },
    // Add more groups as needed
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 hidden lg:block">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Groups</h2>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search groups"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6" />
            <span className="font-medium">Your Groups</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Bell className="w-6 h-6" />
            <span>Notifications</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Plus className="w-6 h-6" />
            <span>Create New Group</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('yourgroups')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'yourgroups'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Your Groups
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'discover'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Create
            </button>
          </nav>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={group.thumbnail}
                  alt={group.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button className="p-1 bg-white rounded-full text-gray-600 hover:text-gray-900">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{group.members}</p>
                    <p className="text-sm text-gray-500">
                      {group.privacy} • Active {group.lastActive}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    View Group
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage; 
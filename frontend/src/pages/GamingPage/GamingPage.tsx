import React, { useState } from 'react';
import { Gamepad2, Users, Trophy, PlayCircle, Search } from 'lucide-react';

const GamingPage = () => {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'play'>('foryou');

  const games = [
    {
      id: 1,
      title: 'Minecraft',
      thumbnail: '/game-thumb-1.jpg',
      players: '2.5M players',
      category: 'Adventure'
    },
    {
      id: 2,
      title: 'Among Us',
      thumbnail: '/game-thumb-2.jpg',
      players: '1.8M players',
      category: 'Social'
    },
    // Add more games as needed
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 hidden lg:block">
        <div className="flex items-center space-x-2 mb-6">
          <Gamepad2 className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Gaming</h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search games"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
            <PlayCircle className="w-6 h-6" />
            <span className="font-medium">Play Games</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Users className="w-6 h-6" />
            <span>Gaming Activity</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Trophy className="w-6 h-6" />
            <span>Tournaments</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('foryou')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'foryou'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'following'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab('play')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'play'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Play Games
            </button>
          </nav>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{game.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{game.players}</p>
                <p className="text-sm text-gray-500">{game.category}</p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamingPage; 
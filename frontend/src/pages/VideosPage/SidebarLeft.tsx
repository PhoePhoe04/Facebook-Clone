import React from 'react';
import { Video, Tv2, Gamepad2, Bookmark } from 'lucide-react';

const SidebarLeft = () => {
  return (
    <div className="w-64 bg-white shadow-lg p-4 hidden lg:block">
      <h2 className="text-2xl font-bold mb-6">Watch</h2>
      
      <nav className="space-y-2">
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg"
        >
          <Video className="w-6 h-6" />
          <span className="font-medium">Home</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          <Tv2 className="w-6 h-6" />
          <span>Live</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          <Gamepad2 className="w-6 h-6" />
          <span>Gaming</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          <Bookmark className="w-6 h-6" />
          <span>Saved Videos</span>
        </a>
      </nav>
    </div>
  );
};

export default SidebarLeft; 
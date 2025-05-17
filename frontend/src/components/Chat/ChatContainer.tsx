import { useChatContext } from '../../contexts/ChatContext';
import ChatWindow from './ChatWindow';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ChatContainer = () => {
  const { activeChats, closeChat, minimizeChat } = useChatContext();

  return (
    <div className="fixed bottom-0 right-4 flex items-end space-x-2 z-40">
      {/* Active chat windows - show maximum 3 windows */}
      <div className="flex items-end space-x-2">
        {activeChats
          .filter(chat => !chat.isMinimized)
          .slice(0, 3)
          .map(chat => (
            <ChatWindow
              key={chat.id}
              user={chat.user}
              onClose={() => closeChat(chat.id)}
              onMinimize={() => minimizeChat(chat.id)}
            />
          ))}
      </div>

      {/* Minimized chats */}
      <div className="flex space-x-2">
        {activeChats
          .filter(chat => chat.isMinimized)
          .map(chat => (
            <div key={chat.id} className="relative group">
              <button
                className="w-12 h-12 rounded-full relative cursor-pointer hover:scale-105 transition-transform"
                onClick={() => minimizeChat(chat.id)}
              >
                <img
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  className="w-full h-full rounded-full border-2 border-white shadow-md"
                />
                {chat.user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeChat(chat.id);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity"
              >
                <XMarkIcon className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatContainer; 
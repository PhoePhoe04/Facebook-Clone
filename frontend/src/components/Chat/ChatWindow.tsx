import { useState, useRef, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  FaceSmileIcon,
  PhotoIcon,
  GifIcon,
  PhoneIcon,
  VideoCameraIcon,
  MinusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useChatContext } from '../../contexts/ChatContext';

interface ChatWindowProps {
  user: {
    id: number;
    name: string;
    avatar: string;
    isOnline?: boolean;
  };
  onClose: () => void;
  onMinimize: () => void;
}

const ChatWindow = ({ user, onClose, onMinimize }: ChatWindowProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useChatContext();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(user.id, message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-[330px] h-[455px] bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="h-[50px] px-2.5 border-b flex items-center justify-between bg-white">
        <div className="flex items-center flex-1 cursor-pointer hover:opacity-80">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full"
            />
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div className="ml-2 flex flex-col justify-center">
            <div className="font-semibold text-[15px] leading-5">{user.name}</div>
            {user.isOnline && (
              <div className="text-[12px] leading-4 text-green-500">Đang hoạt động</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <PhoneIcon className="w-[18px] h-[18px] text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <VideoCameraIcon className="w-[18px] h-[18px] text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onMinimize}>
            <MinusIcon className="w-[18px] h-[18px] text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <XMarkIcon className="w-[18px] h-[18px] text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto bg-white">
        {messages[user.id]?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isOwn && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full mr-2"
              />
            )}
            <div
              className={`px-3 py-2 rounded-[18px] max-w-[65%] text-[15px] ${
                msg.isOwn
                  ? 'bg-[#0084ff] text-white'
                  : 'bg-[#f0f0f0] text-black'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="h-[50px] px-2 py-1.5 border-t bg-white">
        <div className="flex items-center space-x-1">
          <div className="flex">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <PhotoIcon className="w-5 h-5 text-[#0084ff]" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <GifIcon className="w-5 h-5 text-[#0084ff]" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FaceSmileIcon className="w-5 h-5 text-[#0084ff]" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Aa"
              className="w-full h-[36px] px-3 bg-[#f0f0f0] rounded-full outline-none text-[15px]"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={!message.trim()}
          >
            <PaperAirplaneIcon 
              className={`w-5 h-5 ${message.trim() ? 'text-[#0084ff]' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
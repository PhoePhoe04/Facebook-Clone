import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useChatContext } from '../../contexts/ChatContext';

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: Message;
}

const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'notifications'>('inbox');
  const { openChat } = useChatContext();

  // Dữ liệu contacts từ RightSideBar
  const contacts: Contact[] = [
    {
      id: 1,
      name: "Nguyen Van A",
      avatar: "/images/avatar.png",
      isOnline: true,
      lastMessage: {
        id: 1,
        senderId: 1,
        content: "bữa sau rảnh xóa cho",
        timestamp: "3 phút",
        isRead: false
      }
    },
    {
      id: 2,
      name: "Cửu Linh Nguyên Thánh",
      avatar: "/images/avatar2.jpg",
      isOnline: false,
      lastMessage: {
        id: 2,
        senderId: 2,
        content: "con mới học về",
        timestamp: "1 giờ",
        isRead: true
      }
    },
    {
      id: 3,
      name: "Doãn Đại Hiệp",
      avatar: "/images/avatar3.webp",
      isOnline: true,
    }
  ];

  // Lọc contacts theo search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Xử lý khi click vào contact
  const handleContactClick = (contact: Contact) => {
    openChat({
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      isOnline: contact.isOnline
    });
  };

  return (
    <div className="w-[360px] bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
        </div>

        {/* Fixed Tabs */}
        <div className="flex mt-4 bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'inbox'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('inbox')}
          >
            Hộp thư
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Thông báo
          </button>
        </div>
      </div>

      {/* Contact List */}
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleContactClick(contact)}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full"
              />
              {contact.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
              {contact.lastMessage && !contact.lastMessage.isRead && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  1
                </span>
              )}
            </div>

            {/* Contact info */}
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{contact.name}</span>
                {contact.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {contact.lastMessage.timestamp}
                  </span>
                )}
              </div>
              {contact.lastMessage && (
                <div className="flex items-center text-sm">
                  <span className={!contact.lastMessage.isRead ? 'font-semibold' : 'text-gray-500'}>
                    {contact.lastMessage.content}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 
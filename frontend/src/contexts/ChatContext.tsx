import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

interface ChatWindow {
  id: number;
  user: User;
  isMinimized: boolean;
}

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatContextType {
  isListOpen: boolean;
  setIsListOpen: (isOpen: boolean) => void;
  toggleChatList: () => void;
  activeChats: ChatWindow[];
  openChat: (user: User) => void;
  closeChat: (chatId: number) => void;
  minimizeChat: (chatId: number) => void;
  messages: { [chatId: number]: Message[] };
  sendMessage: (chatId: number, content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [activeChats, setActiveChats] = useState<ChatWindow[]>([]);
  const [messages, setMessages] = useState<{ [chatId: number]: Message[] }>({});

  const toggleChatList = () => {
    setIsListOpen(!isListOpen);
  };

  const openChat = (user: User) => {
    // Kiểm tra xem chat đã tồn tại chưa
    const existingChat = activeChats.find(chat => chat.user.id === user.id);
    
    if (existingChat) {
      // Nếu chat đã tồn tại và đang thu nhỏ, mở rộng nó ra
      if (existingChat.isMinimized) {
        setActiveChats(activeChats.map(chat =>
          chat.id === existingChat.id ? { ...chat, isMinimized: false } : chat
        ));
      }
    } else {
      // Tạo chat mới
      const newChat: ChatWindow = {
        id: Date.now(),
        user,
        isMinimized: false
      };

      // Thêm chat mới vào đầu danh sách
      setActiveChats([newChat, ...activeChats]);

      // Khởi tạo messages cho chat mới
      setMessages(prev => ({
        ...prev,
        [newChat.id]: []
      }));
    }
    
    // Đóng danh sách chat
    setIsListOpen(false);
  };

  const closeChat = (chatId: number) => {
    setActiveChats(activeChats.filter(chat => chat.id !== chatId));
    // Xóa messages của chat đã đóng
    const newMessages = { ...messages };
    delete newMessages[chatId];
    setMessages(newMessages);
  };

  const minimizeChat = (chatId: number) => {
    setActiveChats(activeChats.map(chat =>
      chat.id === chatId ? { ...chat, isMinimized: !chat.isMinimized } : chat
    ));
  };

  const sendMessage = (chatId: number, content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      senderId: 1, // ID của user hiện tại
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));
  };

  return (
    <ChatContext.Provider 
      value={{ 
        isListOpen, 
        setIsListOpen, 
        toggleChatList,
        activeChats,
        openChat,
        closeChat,
        minimizeChat,
        messages,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}; 
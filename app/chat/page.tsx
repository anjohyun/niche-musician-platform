'use client';

import { useEffect, useState } from 'react';
import { getUserChatRooms } from '@/lib/actions/chat';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageSquare, Loader } from 'lucide-react';

interface ChatRoom {
  id: string;
  lastMessageAt: string | null;
  otherUser: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    profile: {
      stageName: string;
      avatar: string | null;
    } | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
}

export default function ChatPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    // 로컬스토리지에서 사용자 ID 가져오기
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.userId);
      loadChatRooms(user.userId);
    } else {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      window.location.href = '/auth/login';
    }
  }, []);

  const loadChatRooms = async (userId: string) => {
    setIsLoading(true);
    try {
      const result = await getUserChatRooms(userId);
      if (result.success && result.chatRooms) {
        setChatRooms(result.chatRooms as ChatRoom[]);
        // 첫 번째 채팅방 자동 선택
        if (result.chatRooms.length > 0) {
          setSelectedRoom(result.chatRooms[0] as ChatRoom);
        }
      }
    } catch (error) {
      console.error('Load chat rooms error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Chat Rooms List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">메시지</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>채팅방이 없습니다</p>
              <p className="text-sm mt-2">매칭을 수락하면 채팅방이 생성됩니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {room.otherUser.profile?.stageName?.[0] ||
                        room.otherUser.name?.[0] ||
                        '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {room.otherUser.profile?.stageName || room.otherUser.name}
                        </h3>
                        {room.lastMessageAt && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(room.lastMessageAt).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {room.lastMessage.senderId === currentUserId
                            ? '나: '
                            : ''}
                          {room.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900">
        {selectedRoom ? (
          <ChatWindow
            chatRoomId={selectedRoom.id}
            currentUserId={currentUserId}
            otherUser={selectedRoom.otherUser}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">채팅방을 선택하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

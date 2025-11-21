'use client';

import { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatMessages, markMessagesAsRead } from '@/lib/actions/chat';
import Button from '@/components/ui/Button';
import { Send, Loader } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    profile: {
      stageName: string;
      avatar: string | null;
    } | null;
  };
}

interface ChatWindowProps {
  chatRoomId: string;
  currentUserId: string;
  otherUser: {
    id: string;
    name: string | null;
    profile: {
      stageName: string;
      avatar: string | null;
    } | null;
  };
}

export default function ChatWindow({ chatRoomId, currentUserId, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    // 메시지를 읽음으로 표시
    markMessagesAsRead(chatRoomId, currentUserId);

    // 자동 새로고침 (10초마다)
    const interval = setInterval(() => {
      loadMessages(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [chatRoomId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const result = await getChatMessages(chatRoomId, 50);
      if (result.success && result.messages) {
        setMessages(result.messages as Message[]);
        if (!silent) {
          await markMessagesAsRead(chatRoomId, currentUserId);
        }
      }
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const result = await sendMessage({
        chatRoomId,
        senderId: currentUserId,
        content: newMessage.trim(),
      });

      if (result.success && result.message) {
        setMessages([...messages, result.message as Message]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {otherUser.profile?.stageName?.[0] || otherUser.name?.[0] || '?'}
          </div>
          <div>
            <h3 className="font-semibold">
              {otherUser.profile?.stageName || otherUser.name}
            </h3>
            <p className="text-sm text-gray-500">온라인</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-slate-900"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            메시지가 없습니다. 첫 메시지를 보내보세요!
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender.id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            rows={1}
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            isLoading={isSending}
            className="px-4"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatInput } from '@/components/chat-input'
import { useSocket } from '@/contexts/SocketContext'
import { useUser } from '@/hooks/useUser'
import { ChatOutput } from '@/components/chat-output'
import { getChannelMessages, type Message as ApiMessage } from '@/lib/api'

interface Message {
  text: string
  username: string
  channelId: number
  userId: string
  avatarUrl?: string | null
}

interface UserInfo {
  username: string
  avatarUrl?: string | null
}

const Page = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [messagesByChannel, setMessagesByChannel] = useState<Record<number, Message[]>>({});
  const [userCache, setUserCache] = useState<Record<string, UserInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Default to channel 1 if no channelId in URL
  const currentChannelId = channelId ? parseInt(channelId) : 1;

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Redirect to channel 1 if on /dashboard root
  useEffect(() => {
    if (!channelId) {
      navigate('/dashboard/channel/1', { replace: true });
    }
  }, [channelId, navigate]);

  // Fetch message history when channel changes
  useEffect(() => {
    if (!currentChannelId || isNaN(currentChannelId)) return;

    // If we already have messages for this channel, don't refetch
    if (messagesByChannel[currentChannelId]) return;

    setIsLoading(true);
    getChannelMessages(currentChannelId)
      .then((response) => {
        const formattedMessages: Message[] = response.messages.map((msg: ApiMessage) => ({
          text: msg.message,
          username: msg.username,
          channelId: msg.channelId,
          userId: msg.userId,
          avatarUrl: msg.avatarUrl,
        }));

        // Build user cache from messages
        const newUserCache: Record<string, UserInfo> = {};
        response.messages.forEach((msg: ApiMessage) => {
          if (!userCache[msg.userId]) {
            newUserCache[msg.userId] = {
              username: msg.username,
              avatarUrl: msg.avatarUrl,
            };
          }
        });

        setUserCache((prev) => ({ ...prev, ...newUserCache }));
        setMessagesByChannel((prev) => ({
          ...prev,
          [currentChannelId]: formattedMessages,
        }));
      })
      .catch((error) => {
        console.error('Failed to fetch messages:', error);
        // Initialize with empty array on error
        setMessagesByChannel((prev) => ({
          ...prev,
          [currentChannelId]: [],
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentChannelId, messagesByChannel]);

  // Listen for new messages from Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: { text: string; username: string; channelId: number; userId: string }) => {
      console.log('Received message:', msg);

      // Get avatar from cache
      const avatarUrl = userCache[msg.userId]?.avatarUrl;

      setMessagesByChannel((prev) => ({
        ...prev,
        [msg.channelId]: [...(prev[msg.channelId] || []), {
          text: msg.text,
          username: msg.username,
          channelId: msg.channelId,
          userId: msg.userId,
          avatarUrl,
        }],
      }));
    };

    socket.on('UserMessage', handleMessage);

    return () => {
      socket.off('UserMessage', handleMessage);
    };
  }, [socket]);

  const handleSendMessage = (message: string) => {
    if (!currentChannelId) return;
    socket?.emit('UserMessage', { text: message, channelId: currentChannelId });
  };

  const currentMessages = messagesByChannel[currentChannelId] || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ChatOutput messages={currentMessages} />
      </div>
      <div className='p-4 border-t bg-background'>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Page
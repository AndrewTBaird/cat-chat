'use client';

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatInput } from '@/components/chat-input'
import { useSocket } from '@/contexts/SocketContext'
import { ChatOutput } from '@/components/chat-output'
import { getChannelMessages, type Message as ApiMessage } from '@/lib/api'

interface Message {
  text: string
  username: string
  channelId: number
}

const Page = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [messagesByChannel, setMessagesByChannel] = useState<Record<number, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Default to channel 1 if no channelId in URL
  const currentChannelId = channelId ? parseInt(channelId) : 1;

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
        }));
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

    const handleMessage = (msg: { text: string; username: string; channelId: number }) => {
      console.log('Received message:', msg);
      setMessagesByChannel((prev) => ({
        ...prev,
        [msg.channelId]: [...(prev[msg.channelId] || []), { text: msg.text, username: msg.username, channelId: msg.channelId }],
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

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <ChatOutput messages={currentMessages} />
      <div className='p-4'>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Page
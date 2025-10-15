'use client';

import { ChatInput } from '@/components/chat-input'
import { useSocket } from '@/contexts/SocketContext'
import { ChatOutput } from '@/components/chat-output';

const Page = () => {
  const { socket } = useSocket();

  const handleSendMessage = (message: string) => {
    socket?.emit('message', { text: message })
  }

  return (
    <div className="flex flex-1 flex-col justify-end">
      <ChatInput onSendMessage={handleSendMessage} />
      <ChatOutput />
    </div>
  )
}

export default Page
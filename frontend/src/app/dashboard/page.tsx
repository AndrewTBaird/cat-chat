'use client';

import { useEffect, useState } from 'react'
import { ChatInput } from '@/components/chat-input'
import { useSocket } from '@/contexts/SocketContext'
import { ChatOutput } from '@/components/chat-output';

const Page = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (msg: { text: string }) => {
      console.log(msg)
      setMessages((prevMessages) => [...prevMessages, msg.text])
    }

    socket.on('message', handleMessage)

    return () => {
      socket.off('message', handleMessage)
    }
  }, [socket])

  const handleSendMessage = (message: string) => {
    socket?.emit('message', { text: message })
  }

  return (
    <div className="flex flex-col h-full">
      <ChatOutput messages={messages} />
      <div className='p-4'>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

    </div>
  )
}

export default Page
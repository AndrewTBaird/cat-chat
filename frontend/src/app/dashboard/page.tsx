'use client';

import { useEffect, useState } from 'react'
import { ChatInput } from '@/components/chat-input'
import { useSocket } from '@/contexts/SocketContext'
import { ChatOutput } from '@/components/chat-output';

interface Message {
  text: string
  username: string
}

const Page = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (msg: { text: string; username: string }) => {
      console.log(msg)
      setMessages((prevMessages) => [...prevMessages, { text: msg.text, username: msg.username }])
    }

    socket.on('UserMessage', handleMessage)

    return () => {
      socket.off('UserMessage', handleMessage)
    }
  }, [socket])

  const handleSendMessage = (message: string) => {
    socket?.emit('UserMessage', { text: message })
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
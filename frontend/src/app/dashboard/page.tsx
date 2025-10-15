'use client';

import { useEffect } from 'react'
import { ChatInput } from '@/components/chat-input'
import { useSocket } from '@/contexts/SocketContext'

const Page = () => {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleMessage = () => {
      // Handle incoming messages here
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
    <div className="flex flex-1 flex-col justify-end">
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}

export default Page
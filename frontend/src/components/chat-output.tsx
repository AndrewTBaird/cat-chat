import { useEffect, useState } from "react";
import { Item } from "./ui/item";
import { useSocket } from "@/contexts/SocketContext";

export const ChatOutput = () => {
  const [chats, setChats] = useState<Array<string>>([])

  const { socket } = useSocket();


    useEffect(() => {
      if (!socket) return

      const handleMessage = (msg: { text: string }) => {
        console.log(msg)
        setChats((prevChats) => [...prevChats, msg.text])
      }

      socket.on('message', handleMessage)

      return () => {
        socket.off('message', handleMessage)
      }
    }, [socket])


  const printMessages = () => {
    return chats.map((userMessage, index) => (
      <Item key={index}>{userMessage}</Item>
    ))
  }


  return <>{printMessages()}</>
}


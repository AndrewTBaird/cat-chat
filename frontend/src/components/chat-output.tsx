import { ChatOutputItem } from "./chat-output-item"

interface Message {
  text: string
  username: string
}

interface ChatOutputProps {
  messages: Message[]
}

export const ChatOutput = ({ messages }: ChatOutputProps) => {
  return (
    <div className="flex flex-col gap-2 flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatOutputItem message={message.text} username={message.username} key={index} />
      ))}
    </div>
  )
}


import { ChatOutputItem } from "./chat-output-item"
import { useUser } from '@/hooks/useUser';

interface Message {
  text: string
  username: string
  avatarUrl?: string | null,
  userId: string
}

interface ChatOutputProps {
  messages: Message[]
}

export const ChatOutput = ({ messages }: ChatOutputProps) => {
  const { user, isLoading } = useUser();

  const getAvatarUrl = (message: Message) => {
    if (user === null) {
      return message.avatarUrl
    }

    if (user.id.toString() === message.userId) {
      return user.avatarUrl
    }
    return message.avatarUrl
  }

  return (
    isLoading ? <></> :
    <div className="flex flex-col flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <ChatOutputItem
          message={message.text}
          username={message.username}
          avatarUrl={getAvatarUrl(message)}
          key={index}
        />
      ))}
    </div>
  )
}


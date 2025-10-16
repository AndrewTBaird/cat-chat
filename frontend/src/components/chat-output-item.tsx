
import { CatIcon } from "lucide-react"

interface ChatOutputItemProps {
  message: string
  username: string
}

export const ChatOutputItem = ({ message, username }: ChatOutputItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted" >
      <CatIcon className="w-10 h-10 flex-shrink-0" />
      <div className="flex flex-col">
        <div className="font-semibold">{username}</div>
        <div>{message}</div>
      </div>
    </div>
  )
}
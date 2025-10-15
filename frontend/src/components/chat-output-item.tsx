import { PawPrint } from "lucide-react"
import { Item } from "./ui/item"

interface ChatOutputItemProps {
  message: string
  username: string
}

export const ChatOutputItem = ({ message, username }: ChatOutputItemProps) => {
  return (
    <Item className="p-3 rounded-lg bg-muted">
      <Item>
        <PawPrint/>
      </Item>
      
      <span className="font-semibold">{username}:</span> {message}
    </Item>
  )
}
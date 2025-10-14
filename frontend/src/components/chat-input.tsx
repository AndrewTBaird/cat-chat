import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { MessageCircle, SendHorizonal } from "lucide-react"

export const ChatInput = () => {
  return (
    <InputGroup>
      <InputGroupInput placeholder="Message chat..." />
      <InputGroupAddon>
        <MessageCircle />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <SendHorizonal /> 
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

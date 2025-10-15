import { useState } from 'react'
import { SendHorizonal } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
}

export const ChatInput = ({ onSendMessage, placeholder = 'Message chat...' }: ChatInputProps) => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim()) return

    onSendMessage(message)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <InputGroup>
      <InputGroupInput
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={handleSend}>
          <SendHorizonal />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

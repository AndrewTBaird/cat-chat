interface ChatOutputProps {
  messages: string[]
}

export const ChatOutput = ({ messages }: ChatOutputProps) => {
  return (
    <div className="flex flex-col gap-2 flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div key={index} className="p-3 rounded-lg bg-muted max-w-[80%]">
          {message}
        </div>
      ))}
    </div>
  )
}


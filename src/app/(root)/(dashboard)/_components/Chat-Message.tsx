import type { Message } from "ai"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`max-w-[55%] ${isUser ? "order-2" : "order-1"}`}>
        {isUser ? (
          <div className="bg-[#303030] text-white p-4 rounded-2xl">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div className="text-white">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
            </div>
          </div>
        )}
      </div>

   
    </div>
  )
}

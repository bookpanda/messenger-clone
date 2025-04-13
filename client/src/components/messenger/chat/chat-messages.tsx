import { useEffect, useRef } from "react"

import { Message } from "@/types"

import {
  IncomingMessage,
  OutgoingMessage,
  //  TimestampMessage
} from "./messages"

interface ChatMessagesProps {
  messages: Message[]
  handleAddReaction: (messageId: string, reaction: string) => void
}

export const ChatMessages = (props: ChatMessagesProps) => {
  const { messages, handleAddReaction } = props

  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // Scroll to the bottom every time messages change
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {/* Chat messages go here */}
        {messages.map((message, idx) => {
          return message.type === "incoming" ? (
            <IncomingMessage
              key={idx}
              text={message.text}
              handleAddReaction={(reaction: string) =>
                handleAddReaction(message.id, reaction)
              }
              reaction={message.reaction}
            />
          ) : (
            <OutgoingMessage
              key={idx}
              text={message.text}
              handleAddReaction={(reaction: string) =>
                handleAddReaction(message.id, reaction)
              }
              reaction={message.reaction}
            />
          )
        })}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  )
}

import { useEffect, useRef } from "react"

import { useChatContext } from "@/contexts/chat-context"
import { useSession } from "next-auth/react"

import {
  IncomingMessage,
  OutgoingMessage,
  //  TimestampMessage
} from "./messages"
import { TypingMessage } from "./typing"

interface ChatMessagesProps {
  handleAddReaction: (messageId: number, reaction: string) => void
}

export const ChatMessages = (props: ChatMessagesProps) => {
  const { handleAddReaction } = props
  const { data: session } = useSession()
  const { messages, currentChat, typingUserIDs } = useChatContext()

  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // Scroll to the bottom every time messages change
  const typingDependency = typingUserIDs.join(",")
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, typingDependency])

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {/* Chat messages go here */}
        {messages.map((message, idx) => {
          const sender = currentChat?.participants.find(
            (participant) => participant.id === message.sender_id
          )
          if (!sender) {
            return null
          }

          return message.sender_id !== session?.user?.userId ? (
            <IncomingMessage
              key={idx}
              message={message}
              sender={sender}
              handleAddReaction={(reaction: string) =>
                handleAddReaction(message.id, reaction)
              }
            />
          ) : (
            <OutgoingMessage
              key={idx}
              message={message}
              sender={sender}
              handleAddReaction={(reaction: string) =>
                handleAddReaction(message.id, reaction)
              }
            />
          )
        })}

        {/* Typing indicator */}
        {typingUserIDs.length > 0 && <TypingMessage userIDs={typingUserIDs} />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"

import { useChatContext } from "@/contexts/chat-context"
import { ChatInfo, ChatMessage, User } from "@/types"

import { IncomingMessage, OutgoingMessage } from "./messages"
import { ReadBubbles } from "./read-bubble"
import { TypingMessage } from "./typing"

interface ChatMessagesProps {
  participants: User[]
  user: User
  messages: ChatMessage[]
  typingUserIDs: number[]
  handleToggleReaction: (messageId: number, reaction: string) => void
}

// TODO: Refactor send isMe with participants
export const ChatMessages = (props: ChatMessagesProps) => {
  const { participants, user, messages, typingUserIDs, handleToggleReaction } =
    props

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
          const sender = participants.find(
            (participant) => participant.id === message.sender_id
          )
          if (!sender) {
            return null
          }

          const lastReadUsers = participants.filter((user) =>
            message.last_read_users.includes(user.id || 0)
          )

          return (
            <div key={idx}>
              {message.sender_id !== user.id ? (
                <IncomingMessage
                  message={message}
                  user={user}
                  sender={sender}
                  handleToggleReaction={(reaction: string) =>
                    handleToggleReaction(message.id, reaction)
                  }
                />
              ) : (
                <OutgoingMessage
                  message={message}
                  user={user}
                  sender={sender}
                  handleToggleReaction={(reaction: string) =>
                    handleToggleReaction(message.id, reaction)
                  }
                />
              )}
              <ReadBubbles users={lastReadUsers} />
            </div>
          )
        })}

        {/* Typing indicator */}
        {typingUserIDs.length > 0 && (
          <TypingMessage userIDs={typingUserIDs} participants={participants} />
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  )
}

"use client"

import { Dispatch, SetStateAction } from "react"

import { ChatInfo, ChatMessage, User } from "@/types"

import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface ChatProps {
  chatInfo: ChatInfo
  user: User
  messages: ChatMessage[]
  setOpenChatInfo: Dispatch<SetStateAction<boolean>>
  handleSendMessage: (message: string) => void
  handleTyping: (type: "START" | "END") => void
  typingUserIDs: number[]
  handleToggleReaction: (messageId: number, emoji: string) => void
}

export const ChatBox = (props: ChatProps) => {
  const {
    chatInfo,
    user,
    messages,
    setOpenChatInfo,
    handleSendMessage,
    handleTyping,
    typingUserIDs,
    handleToggleReaction,
  } = props

  if (!messages) {
    return null
  }

  return (
    <div className="bg-primary-background text-primary-foreground flex h-full flex-1 flex-col overflow-hidden rounded-md">
      <ChatHeader
        name={chatInfo.name}
        image={chatInfo.image}
        lastActive={new Date()} // TODO: Check Last Active
        setOpenChatInfo={setOpenChatInfo}
      />
      <ChatMessages
        participants={chatInfo.participants}
        user={user}
        messages={messages}
        handleToggleReaction={handleToggleReaction}
        typingUserIDs={typingUserIDs}
        isGroup={chatInfo.isGroup}
        color={chatInfo.color}
      />
      <ChatInput
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
        emoji={chatInfo.emoji}
      />
    </div>
  )
}

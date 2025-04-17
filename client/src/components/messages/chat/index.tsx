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
  } = props

  if (!messages) {
    return null
  }

  const handleAddReaction = (messageId: number, emoji: string) => {
    console.log(messageId, emoji)
    // setMessages((prevMessages) =>
    //   produce(prevMessages, (draft) => {
    //     const message = draft.find((m) => m.id === messageId)
    //     if (!message) return
    //     const existingIndex = message.reactions.findIndex(
    //       (r) => r.sender_id === session?.user?.userId && r.emoji === emoji
    //     )
    //     if (existingIndex !== -1) {
    //       // remove the reaction if it already exists
    //       message.reactions.splice(existingIndex, 1)
    //     } else {
    //       // add new reaction
    //       message.reactions.push({
    //         id: message.reactions.length + 1,
    //         message_id: messageId,
    //         sender_id: session?.user?.userId || 0,
    //         emoji,
    //         created_at: new Date().toDateString(),
    //       })
    //     }
    //   })
    // )
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
        handleAddReaction={handleAddReaction}
        typingUserIDs={typingUserIDs}
      />
      <ChatInput
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
      />
    </div>
  )
}

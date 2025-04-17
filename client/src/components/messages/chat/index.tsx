"use client"

import { Dispatch, SetStateAction } from "react"

import { toggleMessageReaction } from "@/actions/message/toggle-reaction"
// import { sendMessage } from "@/actions/message/send-message"
import { useChatContext } from "@/contexts/chat-context"
import { ChatInfo, ChatMessage, EventType, User } from "@/types"
import { produce } from "immer"
import { useSession } from "next-auth/react"

import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface ChatProps {
  chatInfo: ChatInfo
  user: User
  messages: ChatMessage[]
  setOpenChatInfo: Dispatch<SetStateAction<boolean>>
  sendMessage: (
    content: string,
    eventType: EventType,
    messageID?: number
  ) => void
  typingUserIDs: number[]
}

export const ChatBox = (props: ChatProps) => {
  const {
    chatInfo,
    user,
    messages,
    setOpenChatInfo,
    sendMessage,
    typingUserIDs,
  } = props
  const { data: session } = useSession()

  const { currentChat, setMessages } = useChatContext()
  if (!messages || !currentChat) {
    return null
  }

  const handleToggleReaction = async (messageId: number, emoji: string) => {
    try {
      const result = await toggleMessageReaction(messageId, emoji)
      console.log("reaction result:", result)
    } catch (error) {
      console.error("Failed to toggle reaction", error)
    }
  }

  const handleSendMessage = async (content: string) => {
    sendMessage(content, "MESSAGE")
  }

  const handleTyping = (type: "START" | "END") => {
    if (type === "START") sendMessage("<placeholder>", "TYPING_START")
    else sendMessage("<placeholder>", "TYPING_END")
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
      />
      <ChatInput
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
      />
    </div>
  )
}

"use client"

import { Dispatch, SetStateAction } from "react"

// import { sendMessage } from "@/actions/message/send-message"
import { useChatContext } from "@/contexts/chat-context"
import { ChatMessage, Profile } from "@/types"
import { produce } from "immer"
import { useSession } from "next-auth/react"

import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface ChatProps {
  profile: Profile
  setOpenChatInfo: Dispatch<SetStateAction<boolean>>
}

export const Chat = (props: ChatProps) => {
  const { profile, setOpenChatInfo } = props
  const { data: session } = useSession()

  const { currentChat, messages, setMessages, setChats, sendMessage } =
    useChatContext()
  if (!messages || !currentChat) {
    return null
  }

  const handleAddReaction = (messageId: number, emoji: string) => {
    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        const message = draft.find((m) => m.id === messageId)
        if (!message) return

        const existingIndex = message.reactions.findIndex(
          (r) => r.sender_id === session?.user?.userId && r.emoji === emoji
        )

        if (existingIndex !== -1) {
          // remove the reaction if it already exists
          message.reactions.splice(existingIndex, 1)
        } else {
          // add new reaction
          message.reactions.push({
            id: message.reactions.length + 1,
            message_id: messageId,
            sender_id: session?.user?.userId || 0,
            emoji,
            created_at: new Date().toDateString(),
          })
        }
      })
    )
  }

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      chat_id: currentChat.id,
      content,
      created_at: new Date().toISOString(),
      sender_id: session?.user?.userId as number,
      reactions: [],
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setChats((prevChats) =>
      produce(prevChats, (draft) => {
        const chat = draft.find((c) => c.id === currentChat.id)
        if (!chat) return

        chat.last_message = newMessage

        // move chat to the top
        const chatIndex = draft.findIndex((c) => c.id === currentChat.id)
        if (chatIndex !== -1) {
          draft.splice(chatIndex, 1)
          draft.unshift(chat)
        }
      })
    )

    sendMessage(content, "MESSAGE")
  }

  const handleTyping = (type: "START" | "END") => {
    if (type === "START") sendMessage("", "TYPING_START")
    else sendMessage("", "TYPING_END")
  }

  return (
    <div className="bg-primary-background text-primary-foreground flex h-full flex-1 flex-col overflow-hidden rounded-md">
      <ChatHeader
        image={profile.image}
        lastActive={profile.lastActive}
        setOpenChatInfo={setOpenChatInfo}
      />
      <ChatMessages handleAddReaction={handleAddReaction} />
      <ChatInput
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
      />
    </div>
  )
}

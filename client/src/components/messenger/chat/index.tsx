"use client"

import { Dispatch, SetStateAction, useState } from "react"

import { Message, Profile } from "@/types"

import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface ChatProps {
  profile: Profile
  setOpenChatInfo: Dispatch<SetStateAction<boolean>>
}

export const Chat = (props: ChatProps) => {
  const { profile, setOpenChatInfo } = props

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "incoming",
      text: "สวัสดีครับ",
      date: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: "2",
      type: "incoming",
      text: "พอจะมีเวลาว่างสัก 2-3 ชั่วโมงไหมครับ",
      date: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: "3",
      type: "incoming",
      text: "เรามาสร้าง chain connection กันเถอะ",
      date: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: "4",
      type: "outgoing",
      text: "ขาย Amway หรอครับ",
      date: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: "5",
      type: "outgoing",
      text: "ไม่เอาโว้ยยยยยย",
      date: new Date(Date.now() - 3 * 3600 * 1000),
    },
  ])

  const handleAddReaction = (messageId: string, reaction: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.id === messageId) {
          // If the reaction is already the same, remove it
          if (message.reaction === reaction) {
            // Remove the property entirely
            const { reaction, ...updatedMessage } = message
            return updatedMessage
          }
          // Otherwise, set the reaction
          return { ...message, reaction }
        }
        return message
      })
    )
  }

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      type: "outgoing",
      text,
      date: new Date(),
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  return (
    <div className="bg-primary-background text-primary-foreground flex h-full flex-1 flex-col overflow-hidden rounded-md">
      <ChatHeader
        name={profile.name}
        image={profile.image}
        lastActive={profile.lastActive}
        setOpenChatInfo={setOpenChatInfo}
      />
      <ChatMessages messages={messages} handleAddReaction={handleAddReaction} />
      <ChatInput handleSendMessage={handleSendMessage} />
    </div>
  )
}

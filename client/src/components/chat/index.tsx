"use client"

import { useState } from "react"

import { Message } from "@/types"

import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { IncomingMessage, OutgoingMessage, TimestampMessage } from "./messages"

const profile = {
  name: "Chanotai Krajeam",
  image: "/thumbnail.jpg",
  lastActive: new Date(Date.now() - 3 * 3600 * 1000),
}

export const Chat = () => {
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

  return (
    <div className="bg-primary-background text-primary-foreground flex h-full flex-1 flex-col overflow-hidden rounded-md">
      <ChatHeader
        name={profile.name}
        image={profile.image}
        lastActive={profile.lastActive}
      />

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
        </div>
      </div>

      <ChatInput />
    </div>
  )
}

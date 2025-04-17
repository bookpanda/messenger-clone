"use client"

import { useEffect } from "react"

import { useChatStore } from "@/stores/chat"
import { ChatInfo } from "@/types"
import Link from "next/link"
import { useParams } from "next/navigation"

import { ChatCard } from "./card/chat-card"

export const InboxTab = ({ initialData }: { initialData: ChatInfo[] }) => {
  const { id } = useParams<{ id: string }>()
  const { chatList: data, setChatList } = useChatStore()

  useEffect(() => {
    setChatList(initialData)
  }, [initialData])

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center">
        No one here!
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
      {data.map((chat, idx) => (
        <Link key={`${chat.id}_${idx}`} href={`/messages/${chat.id}`}>
          <ChatCard
            name={chat.name}
            image={chat.image}
            isActive={chat.id === parseInt(id)}
            lastMessage={chat.lastMessage}
            unreadCount={chat.unreadCount}
          />
        </Link>
      ))}
    </div>
  )
}

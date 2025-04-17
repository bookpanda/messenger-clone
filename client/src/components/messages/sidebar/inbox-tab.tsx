"use client"

import { useEffect } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import Link from "next/link"
import { useParams } from "next/navigation"

import { ChatCard } from "./card/chat-card"

export const InboxTab = () => {
  const { id } = useParams<{ id: string }>()
  const { chatList: data, setChatList } = useChatStore()

  const revalidate = async () => {
    const groups = await getMyChatsAction()
    setChatList(groups)
  }

  useEffect(() => {
    revalidate()
  }, [])

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

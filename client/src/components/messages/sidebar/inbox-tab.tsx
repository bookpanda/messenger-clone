"use client"

import { useEffect } from "react"

import { useChatsQuery } from "@/hooks/use-chats"
import { useChatStore } from "@/stores/chat"
import { ChatInfo } from "@/types"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"

import { ChatCard } from "./card/chat-card"

export const InboxTab = ({ chatList }: { chatList: ChatInfo[] }) => {
  // const { data, isLoading } = useChatsQuery({ initialData: chatList })
  const { id } = useParams<{ id: string }>()
  const { chatList: data, setChatList } = useChatStore()

  useEffect(() => {
    setChatList(chatList)
  }, [chatList])

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center">
        No one here!
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
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

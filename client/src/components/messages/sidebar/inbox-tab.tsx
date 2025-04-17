"use client"

import { useChatsQuery } from "@/hooks/use-chats"
import { ChatInfo } from "@/types"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"

import { ChatCard } from "./card/chat-card"

export const InboxTab = ({ chatList }: { chatList: ChatInfo[] }) => {
  const { data, isLoading } = useChatsQuery({ initialData: chatList })
  const { id } = useParams<{ id: string }>()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="bg-muted-foreground/30 h-18 w-full" />
        ))}
      </div>
    )
  }

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

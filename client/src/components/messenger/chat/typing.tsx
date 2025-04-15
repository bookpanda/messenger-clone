"use client"

import { useChatContext } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react/dist/iconify.js"
import Image from "next/image"

interface TypingProps {
  userIDs: number[]
}

export const TypingMessage = ({ userIDs }: TypingProps) => {
  const { currentChat } = useChatContext()
  if (!currentChat || !currentChat.participants) return null

  const typingUsers = currentChat.participants.filter((user) =>
    userIDs.includes(user.id || 0)
  )

  return (
    <div className={cn("group flex items-end gap-2")}>
      <div className="relative size-7">
        {typingUsers.map((user) => (
          <Image
            key={user.id}
            src={user.profilePictureUrl || ""}
            alt=""
            fill
            className="rounded-full object-cover"
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-chat-incoming-message-bubble-background-color relative flex rounded-full px-3 py-2">
          {[...Array(3)].map((_, i) => (
            <Icon
              key={i}
              icon="icon-park-outline:dot"
              className={cn(
                "mt-1 size-3.5 h-4 animate-bounce text-gray-200",
                i === 0 && "animation-delay-0",
                i === 1 && "animation-delay-200",
                i === 2 && "animation-delay-400"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

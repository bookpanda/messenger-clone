"use client"

import { useChatContext } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"
import { User } from "@/types"
import { Icon } from "@iconify/react/dist/iconify.js"
import Image from "next/image"

interface TypingProps {
  userIDs: number[]
  participants: User[]
}

export const TypingMessage = ({ userIDs, participants }: TypingProps) => {
  const typingUsers = participants.filter((user) =>
    userIDs.includes(user.id || 0)
  )

  return (
    <div className={cn("group flex items-end gap-2")}>
      <div
        className={cn(
          "relative flex h-7",
          typingUsers.length === 1 ? "w-7" : "w-12"
        )}
      >
        {typingUsers.slice(0, 2).map((user, idx) => (
          <div
            key={user.id}
            className="absolute"
            style={{
              left: `${idx * 14}px`, // adjust spacing between avatars
              zIndex: typingUsers.length - idx,
            }}
          >
            <Image
              src={user.profilePictureUrl || ""}
              alt=""
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          </div>
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

import { LastMessage } from "@/types"
import Image from "next/image"

import { BaseCard } from "."

interface ChatCardProps {
  name: string
  image: string
  isActive: boolean
  lastMessage: LastMessage | null
  unreadCount: number
}

export const ChatCard = (props: ChatCardProps) => {
  const { name, image, isActive, lastMessage, unreadCount } = props

  return (
    <BaseCard isActive={isActive}>
      <div className="relative size-14">
        <Image src={image} alt="" fill className="rounded-full object-cover" />
      </div>
      <div className="flex-1 space-y-1">
        <h2 className="line-clamp-1">{name}</h2>
        <div className="text-secondary-text flex items-center gap-1 text-xs">
          {lastMessage && (
            <>
              <p>
                {lastMessage.type === "outgoing"
                  ? `You: ${lastMessage.message}`
                  : lastMessage.message}
              </p>
              <p>&#8226;</p>
              <p>
                {lastMessage.date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          )}
        </div>
      </div>
      {unreadCount ? (
        <div className="flex items-center justify-center">
          <div className="bg-messenger-primary flex size-6 items-center justify-center rounded-full text-xs font-medium">
            {unreadCount}
          </div>
        </div>
      ) : null}
    </BaseCard>
  )
}

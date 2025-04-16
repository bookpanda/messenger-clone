import { LastMessage } from "@/types"
import Image from "next/image"

import { BaseCard } from "."

interface ChatCardProps {
  name: string
  image: string
  isActive: boolean
  lastMessage: LastMessage | null
}

export const ChatCard = (props: ChatCardProps) => {
  const { name, image, isActive, lastMessage } = props

  return (
    <BaseCard isActive={isActive}>
      <div className="relative size-14">
        <Image src={image} alt="" fill className="rounded-full object-cover" />
      </div>
      <div className="space-y-1">
        <h2>{name}</h2>
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
    </BaseCard>
  )
}

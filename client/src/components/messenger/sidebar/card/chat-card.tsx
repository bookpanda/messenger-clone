import Image from "next/image"

import { BaseCard } from "."

interface ChatCardProps {
  name: string
  image: string
  lastMessage: string
  lastMessageFromMe: boolean
  lastMessageDate: Date
  isActive: boolean
}

export const ChatCard = (props: ChatCardProps) => {
  const {
    name,
    image,
    lastMessage,
    lastMessageFromMe,
    lastMessageDate,
    isActive,
  } = props

  return (
    <BaseCard isActive={isActive}>
      <div className="relative size-14">
        <Image src={image} alt="" fill className="rounded-full object-cover" />
      </div>
      <div className="space-y-1">
        <h2>{name}</h2>
        <div className="text-secondary-text flex items-center gap-1 text-xs">
          <p>{lastMessageFromMe ? `You: ${lastMessage}` : lastMessage}</p>
          <p>&#8226;</p>
          <p>
            {lastMessageDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </BaseCard>
  )
}

import { cn } from "@/lib/utils"
import { LastMessage } from "@/types"
import Image from "next/image"

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
    <div
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-md p-2 transition-colors hover:bg-white/10",
        {
          "bg-card-selected-background/20 hover:bg-card-selected-background/20":
            isActive,
        }
      )}
    >
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
    </div>
  )
}

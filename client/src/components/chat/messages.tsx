import { cn } from "@/lib/utils"
import Image from "next/image"

interface MessageProps {
  reaction?: string
}

export const IncomingMessage = (props: MessageProps) => {
  const { reaction } = props

  return (
    <div
      className={cn("flex items-end gap-2", {
        "pb-2": reaction,
      })}
    >
      <div className="relative size-7">
        <Image
          src="/thumbnail.jpg"
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="bg-chat-incoming-message-bubble-background-color relative rounded-full px-3 py-2">
        <p>แต่กุศรัทธาใน work life unbalance</p>
        {reaction && (
          <div className="bg-primary-background absolute right-3 -bottom-3 z-10 flex size-5 items-center justify-center rounded-full">
            {reaction}
          </div>
        )}
      </div>
    </div>
  )
}

export const OutgoingMessage = (props: MessageProps) => {
  const { reaction } = props

  return (
    <div
      className={cn("flex items-end justify-end gap-2", {
        "pb-2": reaction,
      })}
    >
      <div className="bg-chat-outgoing-message-bubble-background-color relative rounded-full px-3 py-2">
        <p>แต่กุศรัทธาใน work life unbalance</p>
        {reaction && (
          <div className="bg-primary-background absolute right-3 -bottom-3 z-10 flex size-5 items-center justify-center rounded-full">
            {reaction}
          </div>
        )}
      </div>
    </div>
  )
}

export const TimestampMessage = () => {
  return (
    <div className="text-placeholder-text px-5 py-4 text-center text-xs">
      7:25 AM
    </div>
  )
}

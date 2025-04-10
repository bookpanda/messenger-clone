import { cn } from "@/lib/utils"
import { EllipsisVertical, Smile } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface MessageProps {
  reaction?: string
}

export const IncomingMessage = (props: MessageProps) => {
  const { reaction } = props

  return (
    <div
      className={cn("group flex items-end gap-2", {
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
      <div className="flex items-center gap-2">
        <div className="bg-chat-incoming-message-bubble-background-color relative rounded-full px-3 py-2">
          <p>แต่กุศรัทธาใน work life unbalance</p>
          {reaction && (
            <div className="bg-primary-background absolute right-3 -bottom-3 z-10 flex size-5 items-center justify-center rounded-full">
              {reaction}
            </div>
          )}
        </div>
        <div className="hidden items-center gap-2 group-hover:flex">
          <Button
            size="icon"
            variant="secondary"
            className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
          >
            <Smile className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
          >
            <EllipsisVertical className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const OutgoingMessage = (props: MessageProps) => {
  const { reaction } = props

  return (
    <div
      className={cn("group flex items-end justify-end gap-2", {
        "pb-2": reaction,
      })}
    >
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 group-hover:flex">
          <Button
            size="icon"
            variant="secondary"
            className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
          >
            <EllipsisVertical className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
          >
            <Smile className="size-5" />
          </Button>
        </div>
        <div className="bg-chat-outgoing-message-bubble-background-color relative rounded-full px-3 py-2">
          <p>แต่กุศรัทธาใน work life unbalance</p>
          {reaction && (
            <div className="bg-primary-background absolute right-3 -bottom-3 z-10 flex size-5 items-center justify-center rounded-full">
              {reaction}
            </div>
          )}
        </div>
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

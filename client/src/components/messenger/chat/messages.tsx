"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { ChatMessage, User } from "@/types"
import { EllipsisVertical, Smile } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MessageProps {
  message: ChatMessage
  sender: User
  reaction?: string
  handleAddReaction: (reaction: string) => void
}

const reactionEmojis = ["🥰", "😢", "😂", "😡", "👍"]

export const IncomingMessage = (props: MessageProps) => {
  const { message, sender, reaction, handleAddReaction } = props
  const { content } = message

  const [isHover, setHover] = useState(false)
  const [isReactionOpen, setReactionOpen] = useState(false)

  useEffect(() => {
    if (!isHover) {
      setReactionOpen(false)
    }
  }, [isHover])

  return (
    <div
      className={cn("flex items-end gap-2", {
        "pb-2": reaction,
      })}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <div className="relative size-7">
        <Image
          src={sender.profilePictureUrl || ""}
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-chat-incoming-message-bubble-background-color relative rounded-full px-3 py-2">
          <p>{content}</p>
          {reaction && (
            <div className="bg-primary-background absolute right-3 -bottom-3 z-10 flex size-5 items-center justify-center rounded-full">
              {reaction}
            </div>
          )}
        </div>
        <div
          className={cn("items-center gap-2", {
            hidden: !isHover,
            flex: isHover,
          })}
        >
          <Popover open={isReactionOpen} onOpenChange={setReactionOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
              >
                <Smile className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className={cn(
                "bg-primary-background text-primary-foreground w-auto rounded-full border border-none border-white/20 px-3 py-2",
                {
                  hidden: !isHover,
                  flex: isHover,
                }
              )}
            >
              {reactionEmojis.map((emoji, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className={cn("size-8 p-0 px-3 text-2xl", {
                    "bg-secondary-background": reaction === emoji,
                  })}
                  onClick={() => {
                    handleAddReaction(emoji)
                    setReactionOpen(false)
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
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
  const { message, reaction, handleAddReaction } = props
  const { content } = message

  const [isHover, setHover] = useState(false)
  const [isReactionOpen, setReactionOpen] = useState(false)

  useEffect(() => {
    if (!isHover) {
      setReactionOpen(false)
    }
  }, [isHover])

  return (
    <div
      className={cn("group flex items-end justify-end gap-2", {
        "pb-2": reaction,
      })}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn("items-center gap-2", {
            hidden: !isHover,
            flex: isHover,
          })}
        >
          <Button
            size="icon"
            variant="secondary"
            className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
          >
            <EllipsisVertical className="size-5" />
          </Button>
          <Popover open={isReactionOpen} onOpenChange={setReactionOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="bg-secondary-background text-primary-foreground size-auto rounded-full p-1 hover:bg-white/10"
              >
                <Smile className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className={cn(
                "bg-primary-background text-primary-foreground w-auto rounded-full border border-none border-white/20 px-3 py-2",
                {
                  hidden: !isHover,
                  flex: isHover,
                }
              )}
            >
              {reactionEmojis.map((emoji, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className={cn("size-8 p-0 px-3 text-2xl", {
                    "bg-secondary-background": reaction === emoji,
                  })}
                  onClick={() => {
                    handleAddReaction(emoji)
                    setReactionOpen(false)
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className="bg-chat-outgoing-message-bubble-background-color relative rounded-full px-3 py-2">
          <p>{content}</p>
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

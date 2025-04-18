"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { ChatMessage, Participant, User } from "@/types"
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
  user: User // me
  sender: Participant // sender
  handleToggleReaction: (reaction: string) => void
  isGroup: boolean
}

interface EmojiMap {
  [emoji: string]: {
    count: number
    senders: number[]
  }
}

const reactionEmojis = ["🥰", "😢", "😂", "😡", "👍"]

export const IncomingMessage = (props: MessageProps) => {
  const { message, user, sender, handleToggleReaction, isGroup } = props
  const { content, reactions } = message

  const [isHover, setHover] = useState(false)
  const [isReactionOpen, setReactionOpen] = useState(false)

  const groupedReactions: EmojiMap = {}
  if (reactions) {
    for (const r of reactions) {
      if (!groupedReactions[r.emoji]) {
        groupedReactions[r.emoji] = {
          count: 0,
          senders: [],
        }
      }
      groupedReactions[r.emoji].count++
      groupedReactions[r.emoji].senders.push(r.sender_id)
    }
  }
  const totalReactions = Object.values(groupedReactions).reduce(
    (sum, r) => sum + r.count,
    0
  )

  useEffect(() => {
    if (!isHover) {
      setReactionOpen(false)
    }
  }, [isHover])

  return (
    <div
      className={cn("flex items-end gap-2", {
        "pb-2": Object.keys(groupedReactions).length > 0,
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
      <div>
        {isGroup && (
          <p className="ml-4 text-xs">{sender.nickname || sender.name}</p>
        )}
        <div className="flex items-center gap-2">
          <div className="bg-chat-incoming-message-bubble-background-color relative rounded-full px-3 py-2">
            <p>{content}</p>
            <div className="absolute -bottom-3 left-3 z-10">
              {Object.keys(groupedReactions).length > 0 && (
                <div className="bg-primary-background flex max-w-full items-center space-x-1 rounded-full px-0.5 py-0.5 text-sm shadow-sm">
                  {Object.entries(groupedReactions)
                    .slice(0, 3)
                    .map(([emoji]) => (
                      <span key={emoji} className="text-md mx-0 leading-none">
                        {emoji}
                      </span>
                    ))}
                  {totalReactions > 1 && (
                    <span className="font-sm mr-1 ml-1 text-xs text-gray-300">
                      {Object.values(groupedReactions).reduce(
                        (sum, r) => sum + r.count,
                        0
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
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
                      "bg-secondary-background": groupedReactions?.[
                        emoji
                      ]?.senders.includes(user.id),
                    })}
                    onClick={() => {
                      handleToggleReaction(emoji)
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
    </div>
  )
}

export const OutgoingMessage = (props: MessageProps) => {
  const { message, user, handleToggleReaction } = props
  const { content, reactions } = message

  const [isHover, setHover] = useState(false)
  const [isReactionOpen, setReactionOpen] = useState(false)

  const groupedReactions: EmojiMap = {}

  if (reactions) {
    for (const r of reactions) {
      if (!groupedReactions[r.emoji]) {
        groupedReactions[r.emoji] = {
          count: 0,
          senders: [],
        }
      }

      groupedReactions[r.emoji].count++
      groupedReactions[r.emoji].senders.push(r.sender_id)
    }
  }
  const totalReactions = Object.values(groupedReactions).reduce(
    (sum, r) => sum + r.count,
    0
  )

  useEffect(() => {
    if (!isHover) {
      setReactionOpen(false)
    }
  }, [isHover])

  return (
    <div
      className={cn("group flex items-end justify-end gap-2", {
        "pb-2": Object.keys(groupedReactions).length > 0,
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
                    "bg-secondary-background": groupedReactions?.[
                      emoji
                    ]?.senders.includes(user.id),
                  })}
                  onClick={() => {
                    handleToggleReaction(emoji)
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
          <div className="absolute right-3 -bottom-3 z-10">
            {Object.keys(groupedReactions).length > 0 && (
              <div className="bg-primary-background flex items-center space-x-1 rounded-full px-0.5 py-0.5 text-sm shadow-sm">
                {Object.entries(groupedReactions)
                  .slice(0, 3)
                  .map(([emoji]) => (
                    <span key={emoji} className="text-md mx-0 leading-none">
                      {emoji}
                    </span>
                  ))}
                {totalReactions > 1 && (
                  <span className="font-sm mr-1 ml-1 text-xs text-gray-300">
                    {Object.values(groupedReactions).reduce(
                      (sum, r) => sum + r.count,
                      0
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
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

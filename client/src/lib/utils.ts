import { Chat, LastMessage } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmoji(input: string): boolean {
  // Basic emoji pattern: covers most common emojis including flags and modifiers
  const emojiRegex =
    /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(?:\p{Emoji_Modifier})?$/u

  return emojiRegex.test(input.trim())
}

export function chatResponseToChatInfo(chat: Chat, userId?: number) {
  const lastMessage: LastMessage | null = chat.last_message
    ? {
        type: chat.last_message.sender_id === userId ? "outgoing" : "incoming",
        message: chat.last_message.content,
        date: new Date(chat.last_message.created_at),
      }
    : null

  if (chat.is_direct) {
    const friend = chat.participants.find(
      (participant) => participant.id !== userId
    )

    return {
      id: chat.id,
      name: friend?.name || "",
      image: friend?.profilePictureUrl || "/thumbnail.jpg",
      color: chat.color,
      emoji: chat.emoji,
      isGroup: !chat.is_direct,
      lastMessage,
      participants: chat.participants,
      unreadCount: chat.unread_count,
    }
  }

  return {
    id: chat.id,
    name: chat.name,
    image: "/thumbnail.jpg", // TODO: Group Image
    color: chat.color,
    emoji: chat.emoji,
    isGroup: !chat.is_direct,
    lastMessage,
    participants: chat.participants,
    unreadCount: chat.unread_count,
  }
}

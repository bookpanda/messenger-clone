import { components } from "@/api/schema"

export type MessageType = "incoming" | "outgoing"

export type Profile = {
  name: string
  image: string
  lastActive: Date
}

export type LastMessage = {
  type: MessageType
  message: string
  date: Date
}

export type Chat = components["schemas"]["dto.ChatResponse"]
export type User = components["schemas"]["dto.UserResponse"]
export type ChatMessage = components["schemas"]["dto.MessageResponse"]
export type Reaction = components["schemas"]["dto.ReactionResponse"]

export type ChatWithProfile = {
  chat: Chat
  profile: Profile
}

export type ChatInfo = {
  id: number
  name: string
  image: string
  lastMessage: LastMessage | null
  participants: User[]
  unreadCount: number
}

export type CommunityInfo = {
  lastMessage: LastMessage | null
  unreadCount: number
  id: number
  name: string
  image: string
  participants: User[]
  isMember: boolean
}

export type EventType =
  | "ERROR"
  | "CONNECT"
  | "MESSAGE"
  | "MESSAGE_UPDATE"
  | "ACK_READ"
  | "READ"
  | "TYPING_START"
  | "TYPING_END"
  | "ONLINE_USERS"
  | "UNREAD_MESSAGE"
  | "REACTION"
export type RealtimeMessage = {
  event_type: EventType
  content: string
  sender_id: number
  chat_id: number
  message_id?: number
}

export type SidebarTab = "inbox" | "people" | "communities"

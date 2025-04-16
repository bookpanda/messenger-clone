import { components } from "@/api/schema"

export type MessageType = "incoming" | "outgoing"

export type Profile = {
  name: string
  image: string
  lastActive: Date
}

export type Chat = components["schemas"]["dto.ChatResponse"]
export type User = components["schemas"]["dto.UserResponse"]
export type ChatMessage = components["schemas"]["dto.MessageResponse"]
export type Reaction = components["schemas"]["dto.ReactionResponse"]

export type ChatWithProfile = {
  chat: Chat
  profile: Profile
}

export type EventType =
  | "MESSAGE"
  | "UNREAD_MESSAGE"
  | "ERROR"
  | "TYPING_START"
  | "TYPING_END"
  | "REACTION"
  | "READ"
export type RealtimeMessage = {
  event_type: EventType
  content: string
  sender_id: number
  message_id?: number
}

export type SidebarTab = "inbox" | "people"

import { components } from "@/api/schema"

export type MessageType = "incoming" | "outgoing"

export type Message = {
  id: number
  type: MessageType
  text: string
  date: Date
  reaction?: string
}

export type Profile = {
  name: string
  image: string
  lastActive: Date
}

export type Chat = components["schemas"]["dto.ChatResponse"]
export type User = components["schemas"]["dto.UserResponse"]
export type ChatMessage = components["schemas"]["dto.MessageResponse"]
export type Reaction = components["schemas"]["dto.ReactionResponse"]

export type EventType = "MESSAGE" | "ERROR" | "TYPING" | "REACTION" | "READ"
export type RealtimeMessage = {
  event_type: EventType
  content: string
  sender_id: number
}

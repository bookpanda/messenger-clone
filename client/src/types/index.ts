export type MessageType = "incoming" | "outgoing"

export type Message = {
  id: string
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

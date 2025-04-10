export type MessageType = "incoming" | "outgoing"

export type Message = {
  id: string
  type: MessageType
  text: string
  date: Date
  reaction?: string
}

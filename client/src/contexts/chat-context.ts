import { Dispatch, SetStateAction, createContext, useContext } from "react"

import { Chat, ChatMessage } from "@/types"
import { SendMessage } from "react-use-websocket"

interface ChatContext {
  chats: Chat[]
  setChats: Dispatch<SetStateAction<Chat[]>>
  addChat: (chat: Chat) => void
  currentChat: Chat
  setCurrentChat: Dispatch<SetStateAction<Chat>>
  messages: ChatMessage[]
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  sendMessage: SendMessage
  lastMessage: MessageEvent | null
}

export const ChatContext = createContext<ChatContext>({
  chats: [],
  setChats: () => {},
  addChat: () => {},
  currentChat: {} as Chat,
  setCurrentChat: () => {},
  messages: [],
  setMessages: () => {},
  sendMessage: () => {},
  lastMessage: null,
})

export const useChatContext = () => {
  return useContext(ChatContext)
}

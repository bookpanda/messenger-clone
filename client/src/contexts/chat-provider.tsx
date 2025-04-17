"use client"

import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { getChatMessages } from "@/actions/message/get-chat-messages"
import { Chat, ChatMessage, EventType, RealtimeMessage } from "@/types"
import { produce } from "immer"
import { useSession } from "next-auth/react"
import useWebSocket from "react-use-websocket"

import { ChatContext } from "./chat-context"

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat>({} as Chat)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUserIDs, setTypingUserIDs] = useState<number[]>([])
  // const { chats: myChats } = useGetMyChats()

  const { data: session } = useSession()
  const socketUrl = useMemo(() => {
    if (!session?.accessToken || !currentChat?.id) return null
    return `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/message/ws?accessToken=${session.accessToken}&chatID=${currentChat.id}`
  }, [session?.accessToken, currentChat?.id])

  const { sendMessage: wsSendMessage, lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("open"),
    onError: (event) => console.log("error", event),
    onClose: () => console.log("close"),
  })

  // useEffect(() => {
  //   setChats(myChats)
  //   if (!myChats[0]) {
  //     return
  //   }

  //   const sortedChats = sortChats(myChats)
  //   setChats(sortedChats)
  //   setCurrentChat(sortedChats[0])
  //   ;(async () => {
  //     const res = await getChatMessages(sortedChats[0].id)
  //     if (res) setMessages(res)
  //   })()
  // }, [myChats])

  const sendMessage = useCallback(
    (content: string, eventType: EventType, messageID?: number) => {
      const payload: RealtimeMessage = {
        event_type: eventType,
        content,
        sender_id: 0, // don't care
      }
      if (messageID) {
        payload.message_id = messageID
      }
      console.log(`sendMessage`, payload)
      wsSendMessage(JSON.stringify(payload))
    },
    [wsSendMessage]
  )

  useEffect(() => {
    if (!lastMessage) return
    const message: RealtimeMessage = JSON.parse(lastMessage.data)
    console.log("message", message)

    switch (message.event_type) {
      case "MESSAGE":
      case "UNREAD_MESSAGE":
        const newMessage: ChatMessage = {
          id: message.message_id || 0,
          chat_id: currentChat.id,
          sender_id: message.sender_id,
          content: message.content,
          created_at: new Date().toDateString(),
          last_read_users: [],
          reactions: [],
        }
        setMessages((prevMessages) =>
          produce(prevMessages, (draft) => {
            draft.push(newMessage)
          })
        )
        setChats((prevChats) =>
          produce(prevChats, (draft) => {
            const chat = draft.find((c) => c.id === currentChat.id)
            if (!chat) return
            chat.last_message = newMessage

            // move chat to the top
            const chatIndex = draft.findIndex((c) => c.id === currentChat.id)
            if (chatIndex !== -1) {
              draft.splice(chatIndex, 1)
              draft.unshift(chat)
            }
          })
        )
        sendMessage("<read>", "READ", message.message_id)
        break
      case "READ":
        setMessages((prevMessages) =>
          produce(prevMessages, (draft) => {
            const prevReadMessage = draft.find((m) =>
              m.last_read_users.includes(message.sender_id)
            )
            if (prevReadMessage) {
              const index = prevReadMessage.last_read_users.indexOf(
                message.sender_id
              )
              if (index !== -1) prevReadMessage.last_read_users.splice(index, 1)
            }
            const readMessage = draft.find((m) => m.id === message.message_id)
            if (!readMessage) return
            readMessage.last_read_users.push(message.sender_id)
          })
        )
        break
      case "TYPING_START":
        setTypingUserIDs((prev) =>
          produce(prev, (draft) => {
            if (!draft.includes(message.sender_id)) {
              draft.push(message.sender_id)
            }
          })
        )
        break
      case "TYPING_END":
        setTypingUserIDs((prev) =>
          produce(prev, (draft) => {
            const index = draft.indexOf(message.sender_id)
            if (index !== -1) {
              draft.splice(index, 1)
            }
          })
        )
        break
    }
  }, [lastMessage, currentChat.id, sendMessage])

  const addChat = (chat: Chat) => {
    setChats(
      produce((draft) => {
        draft.unshift(chat)
      })
    )
  }

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        addChat,
        chats,
        setChats,
        messages,
        setMessages,
        sendMessage,
        typingUserIDs,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const sortChats = (chats: Chat[]) => {
  return [...chats].sort((a, b) => {
    const dateA = new Date(a.last_message?.created_at ?? 0).getTime()
    const dateB = new Date(b.last_message?.created_at ?? 0).getTime()
    return dateB - dateA // latest message first
  })
}

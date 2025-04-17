"use client"

import { useCallback, useEffect, useState } from "react"

import {
  ChatInfo,
  ChatMessage,
  EventType,
  RealtimeMessage,
  User,
} from "@/types"
import { produce } from "immer"
import useWebSocket from "react-use-websocket"

import { ChatBox } from "../chat"
import { ChatInfoPanel } from "../chat-info"

export const Message = ({
  accessToken,
  user,
  chatInfo,
  chatHistory,
}: {
  accessToken: string
  user: User
  chatInfo: ChatInfo
  chatHistory: ChatMessage[]
}) => {
  const [openChatInfo, setOpenChatInfo] = useState(true)

  const socketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/message/ws?accessToken=${accessToken}&chatID=${chatInfo.id}`
  const { sendMessage: wsSendMessage, lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("open"),
    onError: (event) => console.log("error", event),
    onClose: () => console.log("close"),
  })

  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory)
  const [typingUserIDs, setTypingUserIDs] = useState<number[]>([])

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
      // console.log(`sendMessage`, payload)
      wsSendMessage(JSON.stringify(payload))
    },
    [wsSendMessage]
  )

  useEffect(() => {
    // send interval 3 sec that I'm still active
    const interval = setInterval(() => {
      sendMessage("<still_active>", "STILL_ACTIVE")
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!lastMessage) return
    const message: RealtimeMessage = JSON.parse(lastMessage.data)
    console.log("message", message)

    switch (message.event_type) {
      case "MESSAGE":
        const newMessage: ChatMessage = {
          id: message.message_id || 0,
          chat_id: chatInfo.id,
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
        break
      case "STILL_ACTIVE":
        setMessages((prevMessages) =>
          produce(prevMessages, (draft) => {
            const lastIndex = draft.length - 1
            if (lastIndex < 0) return

            // 1. Clear old last_read_users
            for (let i = 0; i < lastIndex; i++) {
              draft[i].last_read_users = []
            }

            // 2. Set last message's last_read_users to [99]
            draft[lastIndex].last_read_users = [message.sender_id]
          })
        )
        break
      case "UNREAD_MESSAGE":
        //   const newMessage: ChatMessage = {
        //     id: message.message_id || 0,
        //     chat_id: currentChat.id,
        //     sender_id: message.sender_id,
        //     content: message.content,
        //     created_at: new Date().toDateString(),
        //     last_read_users: [],
        //     reactions: [],
        //   }
        //   setMessages((prevMessages) =>
        //     produce(prevMessages, (draft) => {
        //       draft.push(newMessage)
        //     })
        //   )
        //   setChats((prevChats) =>
        //     produce(prevChats, (draft) => {
        //       const chat = draft.find((c) => c.id === currentChat.id)
        //       if (!chat) return
        //       chat.last_message = newMessage

        //       // move chat to the top
        //       const chatIndex = draft.findIndex((c) => c.id === currentChat.id)
        //       if (chatIndex !== -1) {
        //         draft.splice(chatIndex, 1)
        //         draft.unshift(chat)
        //       }
        //     })
        //   )
        // sendMessage("<read>", "READ", message.message_id)
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
  }, [lastMessage, sendMessage])

  return (
    <div className="flex min-h-0 flex-1 gap-4 p-4">
      <ChatBox
        setOpenChatInfo={setOpenChatInfo}
        user={user}
        chatInfo={chatInfo}
        messages={messages}
        sendMessage={sendMessage}
        typingUserIDs={typingUserIDs}
      />
      {openChatInfo && (
        <ChatInfoPanel name={chatInfo.name} image={chatInfo.image} />
      )}
    </div>
  )
}

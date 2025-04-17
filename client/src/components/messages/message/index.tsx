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

  const socketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/message/ws?accessToken=${accessToken}`
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
        chat_id: chatInfo.id,
        sender_id: 0, // don't care
      }
      if (messageID) {
        payload.message_id = messageID
      }
      wsSendMessage(JSON.stringify(payload))
    },
    [wsSendMessage]
  )

  const ackRead = useCallback((messageId: number) => {
    const payload: RealtimeMessage = {
      event_type: "ACK_READ",
      content: "<read>",
      chat_id: chatInfo.id,
      sender_id: user.id,
      message_id: messageId,
    }
    wsSendMessage(JSON.stringify(payload))
  }, [])

  useEffect(() => {
    if (!lastMessage) return
    const message: RealtimeMessage = JSON.parse(lastMessage.data)
    console.log("message", message)

    switch (message.event_type) {
      case "MESSAGE_UPDATE":
        if (message.chat_id === chatInfo.id) {
          const newMessage: ChatMessage = {
            id: message.message_id || 0,
            chat_id: chatInfo.id,
            sender_id: message.sender_id,
            content: message.content,
            created_at: new Date().toDateString(),
            read_by: [],
            reactions: [],
          }
          setMessages((prevMessages) =>
            produce(prevMessages, (draft) => {
              draft.push(newMessage)
            })
          )

          if (message.message_id) ackRead(message.message_id)
        }
        break
      case "READ":
        if (message.chat_id === chatInfo.id) {
          setMessages((prevMessages) =>
            produce(prevMessages, (draft) => {
              const prevReadMessage = draft.find((m) =>
                m.read_by.includes(message.sender_id)
              )
              if (prevReadMessage) {
                const index = prevReadMessage.read_by.indexOf(message.sender_id)
                if (index !== -1) prevReadMessage.read_by.splice(index, 1)
              }
              const readMessage = draft.find((m) => m.id === message.message_id)
              if (!readMessage) return
              readMessage.read_by.push(message.sender_id)
            })
          )
        }
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

      case "TYPING_START":
        if (message.chat_id === chatInfo.id) {
          setTypingUserIDs((prev) =>
            produce(prev, (draft) => {
              if (!draft.includes(message.sender_id)) {
                draft.push(message.sender_id)
              }
            })
          )
        }
        break
      case "TYPING_END":
        if (message.chat_id === chatInfo.id) {
          setTypingUserIDs((prev) =>
            produce(prev, (draft) => {
              const index = draft.indexOf(message.sender_id)
              if (index !== -1) {
                draft.splice(index, 1)
              }
            })
          )
        }
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

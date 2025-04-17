"use client"

import { useCallback, useEffect, useState } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import {
  ChatInfo,
  ChatMessage,
  EventType,
  LastMessage,
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
  const { chatList, updateChatLastMessage, clearChatUnread, setChatList } =
    useChatStore()
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
    [wsSendMessage, chatInfo.id]
  )

  const ackRead = useCallback(
    (messageId: number) => {
      const payload: RealtimeMessage = {
        event_type: "ACK_READ",
        content: "<read>",
        chat_id: chatInfo.id,
        sender_id: user.id,
        message_id: messageId,
      }
      wsSendMessage(JSON.stringify(payload))
    },
    [chatInfo.id, user.id, wsSendMessage]
  )

  useEffect(() => {
    // send a connect message when the component mounts
    const payload: RealtimeMessage = {
      event_type: "CONNECT",
      content: "<connect>",
      chat_id: chatInfo.id,
      sender_id: user.id,
    }
    wsSendMessage(JSON.stringify(payload))

    clearChatUnread(chatInfo.id)
  }, [])

  const handleNewMessage = async (message: RealtimeMessage) => {
    if (!chatList.find((chat) => chat.id === message.chat_id)) {
      const chatList = await getMyChatsAction()
      setChatList(chatList)
    } else {
      const lastMessage: LastMessage = {
        type: message.sender_id === user.id ? "outgoing" : "incoming",
        message: message.content,
        date: new Date(),
      }
      updateChatLastMessage(
        message.chat_id,
        lastMessage,
        message.chat_id !== chatInfo.id // If the message is not from the current chat, mark it as unread
      )
    }
  }

  useEffect(() => {
    if (!lastMessage) return
    const message: RealtimeMessage = JSON.parse(lastMessage.data)
    console.log("message", message)

    switch (message.event_type) {
      case "MESSAGE_UPDATE":
        handleNewMessage(message)

        // Current Chat's message arrived
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
        if (message.chat_id === chatInfo.id && message.sender_id !== user.id) {
          setMessages((prevMessages) =>
            produce(prevMessages, (draft) => {
              // Remove sender_id from all messages
              for (const m of draft) {
                const index = m.read_by.indexOf(message.sender_id)
                if (index !== -1) {
                  m.read_by.splice(index, 1)
                }
              }

              // Add sender_id only to the read message
              const target = draft.find((m) => m.id === message.message_id)
              if (target && !target.read_by.includes(message.sender_id)) {
                target.read_by.push(message.sender_id)
              }
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
        if (message.chat_id === chatInfo.id && message.sender_id !== user.id) {
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
        if (message.chat_id === chatInfo.id && message.sender_id !== user.id) {
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
  }, [lastMessage, sendMessage, ackRead, chatInfo.id, user.id])

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

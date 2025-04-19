"use client"

import { useEffect, useState } from "react"

import { chatResponseToChatInfo } from "@/lib/utils"
import { Chat, ChatInfo, ChatMessage, RealtimeMessage, User } from "@/types"
import { produce } from "immer"

import { ChatBox } from "../chat"
import { ChatInfoPanel } from "../chat-info"
import { useChatList } from "../hooks/use-chat-list"
import { useSocket } from "../hooks/use-socket"

export const Message = ({
  accessToken,
  user,
  chatId,
  initialChatInfo,
  chatHistory,
}: {
  accessToken: string
  user: User
  chatId: number
  initialChatInfo: ChatInfo
  chatHistory: ChatMessage[]
}) => {
  const {
    clearChatUnread,
    handleUpdateChatList,
    setOnlineUsers,
    handleReactionPreviewChatList,
  } = useChatList()
  const [openChatInfo, setOpenChatInfo] = useState(true)

  const {
    wsLastMessage,
    handleOpenConnection,
    handleTyping,
    handleSendMessage,
    handleAckRead,
    handleSendReaction,
  } = useSocket({ accessToken })

  const [chatInfo, setChatInfo] = useState<ChatInfo>(initialChatInfo)
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory)
  const [typingUserIDs, setTypingUserIDs] = useState<number[]>([])

  useEffect(() => {
    handleOpenConnection(chatId)
    clearChatUnread(chatId)
  }, [chatId])

  useEffect(() => {
    if (!wsLastMessage) return
    const message: RealtimeMessage = JSON.parse(wsLastMessage.data)
    console.log("message", message)

    switch (message.event_type) {
      case "ONLINE_USERS":
        const onlineUsers: User[] = JSON.parse(message.content)
        setOnlineUsers(onlineUsers)
        break
      case "CHAT_INFO_UPDATE":
        const chat: Chat = JSON.parse(message.content)
        setChatInfo(chatResponseToChatInfo(chat))
        break
      case "MESSAGE_UPDATE":
        // Add Chat to sidebar if not exists and update current chat message
        handleUpdateChatList(message, message.chat_id !== chatId)

        // Current Chat's message arrived
        if (message.chat_id === chatId) {
          const newMessage: ChatMessage = {
            id: message.message_id || 0,
            chat_id: chatId,
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

          if (message.message_id) handleAckRead(chatId, message.message_id)
        }
        break
      case "READ":
        if (message.chat_id === chatId && message.sender_id !== user.id) {
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
      case "TYPING_START":
        if (message.chat_id === chatId && message.sender_id !== user.id) {
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
        if (message.chat_id === chatId && message.sender_id !== user.id) {
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
      case "REACTION":
        handleReactionPreviewChatList(
          message,
          user.name,
          message.chat_id !== chatId
        )
        if (message.chat_id !== chatId) return
        if (message.emoji_action) return
        setMessages((prevMessages) =>
          produce(prevMessages, (draft) => {
            const msg = draft.find((m) => m.id === message.message_id)
            if (!msg) return

            const existingIndex = msg.reactions.findIndex(
              (r) =>
                r.sender_id === message.sender_id && r.emoji === message.content
            )

            if (existingIndex !== -1) {
              // Toggle off → remove reaction
              msg.reactions.splice(existingIndex, 1)
            } else {
              // Toggle on → add new reaction
              msg.reactions.push({
                id: Date.now(), // For UI only
                emoji: message.content,
                sender_id: message.sender_id,
                message_id: message.message_id!,
                created_at: new Date().toISOString(),
              })
            }
          })
        )

        break
    }
  }, [wsLastMessage, chatId, user.id])

  return (
    <div className="flex min-h-0 flex-1 gap-4 p-4">
      <ChatBox
        setOpenChatInfo={setOpenChatInfo}
        user={user}
        chatInfo={chatInfo}
        messages={messages}
        handleSendMessage={(message: string) =>
          handleSendMessage(chatId, message)
        }
        handleTyping={(type: "START" | "END") => handleTyping(chatId, type)}
        typingUserIDs={typingUserIDs}
        handleToggleReaction={async (messageId, emoji) => {
          handleSendReaction(chatId, messageId, emoji, user.id)
        }}
      />
      {openChatInfo && <ChatInfoPanel chatId={chatId} chatInfo={chatInfo} />}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

import { toggleMessageReaction } from "@/actions/message/toggle-reaction"
import {
  ChatInfo,
  ChatMessage,
  Participant,
  RealtimeMessage,
  User,
} from "@/types"
import { produce } from "immer"

import { ChatBox } from "../chat"
import { ChatInfoPanel } from "../chat-info"
import { useChatList } from "../hooks/use-chat-list"
import { useSocket } from "../hooks/use-socket"

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

  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [typingUserIDs, setTypingUserIDs] = useState<number[]>([])

  useEffect(() => {
    handleOpenConnection(chatInfo.id)
    clearChatUnread(chatInfo.id)
  }, [chatInfo.id])

  useEffect(() => {
    if (!wsLastMessage) return
    const message: RealtimeMessage = JSON.parse(wsLastMessage.data)
    console.log("message", message)

    switch (message.event_type) {
      case "ONLINE_USERS":
        const onlineUsers: User[] = JSON.parse(message.content)
        setOnlineUsers(onlineUsers)
        break
      case "CHAT_PARTICIPANTS":
        const users: Participant[] = JSON.parse(message.content)
        setParticipants(users)
        break
      case "MESSAGE_UPDATE":
        // Add Chat to sidebar if not exists and update current chat message
        handleUpdateChatList(message, message.chat_id !== chatInfo.id)

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

          if (message.message_id) handleAckRead(chatInfo.id, message.message_id)
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
      case "REACTION":
        // handleReactionPreviewChatList(message, user.name)
        if (message.chat_id !== chatInfo.id) return
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
  }, [wsLastMessage, chatInfo.id, user.id])

  return (
    <div className="flex min-h-0 flex-1 gap-4 p-4">
      <ChatBox
        setOpenChatInfo={setOpenChatInfo}
        user={user}
        chatInfo={chatInfo}
        messages={messages}
        participants={participants}
        handleSendMessage={(message: string) =>
          handleSendMessage(chatInfo.id, message)
        }
        handleTyping={(type: "START" | "END") =>
          handleTyping(chatInfo.id, type)
        }
        typingUserIDs={typingUserIDs}
        handleToggleReaction={async (messageId, emoji) => {
          handleSendReaction(chatInfo.id, messageId, emoji, user.id)
        }}
      />
      {openChatInfo && (
        <ChatInfoPanel name={chatInfo.name} image={chatInfo.image} />
      )}
    </div>
  )
}

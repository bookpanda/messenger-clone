"use client"

import { useState } from "react"

import { Chat } from "./chat"
import { ChatInfo } from "./chat-info"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

export const Messenger = () => {
  const [openChatInfo, setOpenChatInfo] = useState(false)

  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Body */}
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <Chat setOpenChatInfo={setOpenChatInfo} />
          {openChatInfo && <ChatInfo />}
        </div>
      </div>
    </div>
  )
}

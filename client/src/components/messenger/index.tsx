"use client"

import { useState } from "react"

import { Profile } from "@/types"

import { Chat } from "./chat"
import { ChatInfo } from "./chat-info"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

const profile: Profile = {
  name: "Chanotai Krajeam",
  image: "/thumbnail.jpg",
  lastActive: new Date(Date.now() - 3 * 3600 * 1000),
}

export const Messenger = () => {
  const [openChatInfo, setOpenChatInfo] = useState(true)

  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Body */}
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <Chat profile={profile} setOpenChatInfo={setOpenChatInfo} />
          {openChatInfo && <ChatInfo profile={profile} />}
        </div>
      </div>
    </div>
  )
}

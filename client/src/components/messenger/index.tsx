"use client"

import { useState } from "react"

import { Profile } from "@/types"
import { useSession } from "next-auth/react"

import { Header } from "../header"
import { LoadingScreen } from "../loading-screen"
import { Chat } from "./chat"
import { ChatInfo } from "./chat-info"
import { Sidebar } from "./sidebar"

const profile: Profile = {
  name: "Chanotai Krajeam",
  image: "/thumbnail.jpg",
  lastActive: new Date(Date.now() - 3 * 3600 * 1000),
}

export const Messenger = () => {
  const [openChatInfo, setOpenChatInfo] = useState(true)
  const { status } = useSession()

  if (status === "loading") {
    return <LoadingScreen />
  }

  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Body */}
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          <Chat profile={profile} setOpenChatInfo={setOpenChatInfo} />
          {openChatInfo && <ChatInfo />}
        </div>
      </div>
    </div>
  )
}

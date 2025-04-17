import { ReactNode } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/messages/sidebar"

export default async function Layout({ children }: { children: ReactNode }) {
  const chatList = await getMyChatsAction()

  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <Sidebar chatList={chatList} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}

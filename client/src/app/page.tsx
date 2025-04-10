import { Chat } from "@/components/chat"
import { ChatInfo } from "@/components/chat-info"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <div className="bg-secondary-background flex h-dvh flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Body */}
        <div className="flex flex-1 gap-4 p-4">
          <Chat />
          <ChatInfo />
        </div>
      </div>
    </div>
  )
}

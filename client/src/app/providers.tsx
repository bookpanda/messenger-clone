"use client"

import { ReactNode } from "react"

import { ChatProvider } from "@/contexts/chat-provider"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ChatProvider>{children}</ChatProvider>
    </SessionProvider>
  )
}

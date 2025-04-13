"use client"

import { ReactNode } from "react"

import { ChatProvider } from "@/contexts/chat-provider"

export default function Providers({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>
}

"use client"

import { ReactNode, useEffect, useState } from "react"

import { ChatProvider } from "@/contexts/chat-provider"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <SessionProvider>
      <ChatProvider>{children}</ChatProvider>
    </SessionProvider>
  )
}

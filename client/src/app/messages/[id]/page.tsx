import { getChatAction } from "@/actions/chat/get-chat"
import { getChatMessages } from "@/actions/message/get-chat-messages"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { Message } from "@/components/messages/message"

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params

  const session = await auth()
  const chatInfo = await getChatAction(id)
  const chatHistory = await getChatMessages(id)

  if (!session || !session.accessToken || !session.user) {
    redirect("/")
  }

  return (
    <Message
      accessToken={session.accessToken}
      user={{
        id: session.user.userId,
        name: session.user.name,
        email: session.user.email,
        profilePictureUrl: session.user.image,
      }}
      chatId={chatInfo.id}
      initialChatInfo={chatInfo}
      chatHistory={chatHistory}
    />
  )
}

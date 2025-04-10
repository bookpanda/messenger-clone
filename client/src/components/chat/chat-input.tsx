import { SyntheticEvent, useState } from "react"

import { Images, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  handleSendMessage: (text: string) => void
}

export const ChatInput = (props: ChatInputProps) => {
  const { handleSendMessage } = props

  const [message, setMessage] = useState("")

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (message.trim() === "") return

    handleSendMessage(message)
    setMessage("")
  }

  return (
    <div className="flex flex-initial items-center gap-2 px-4 py-3">
      <Button
        size="icon"
        className="text-chat-composer-button-color size-auto rounded-full p-1"
        variant="ghost"
      >
        <Images className="size-5" />
      </Button>
      <form className="flex-1" onSubmit={handleSubmit}>
        <Input
          className="bg-chat-composer-input-background-color text-primary-text rounded-full border-none ring-0 outline-none"
          placeholder="Aa"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </form>
      <Button
        size="icon"
        className="text-chat-composer-button-color size-auto rounded-full p-1"
        variant="ghost"
      >
        <ThumbsUp className="size-5" />
      </Button>
    </div>
  )
}

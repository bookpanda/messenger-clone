import { SyntheticEvent, useRef, useState } from "react"

import { Images, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  handleSendMessage: (text: string) => void
  handleTyping: (type: "START" | "END") => void
  emoji: string
}

export const ChatInput = (props: ChatInputProps) => {
  const { handleSendMessage, handleTyping, emoji } = props

  const [message, setMessage] = useState("")
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTyping = useRef(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setMessage(val)

    if (!isTyping.current && val.trim() !== "") {
      handleTyping("START")
      isTyping.current = true
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      if (isTyping.current) {
        handleTyping("END")
        isTyping.current = false
      }
    }, 2000) // 2 seconds of no typing triggers END
  }

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (message.trim() === "") return

    handleSendMessage(message)
    setMessage("")

    if (isTyping.current) {
      handleTyping("END")
      isTyping.current = false
      if (typingTimeout.current) clearTimeout(typingTimeout.current)
    }
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
          onChange={handleChange}
          value={message}
        />
      </form>
      <Button
        size="icon"
        className="text-chat-composer-button-color size-9 rounded-full text-xl"
        variant="ghost"
        onClick={() => handleSendMessage(emoji)}
      >
        {emoji}
      </Button>
    </div>
  )
}

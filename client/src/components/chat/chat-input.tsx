import { Images, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const ChatInput = () => {
  return (
    <div className="flex flex-initial items-center gap-2 px-4 py-3">
      <Button
        size="icon"
        className="text-chat-composer-button-color size-auto rounded-full p-1"
        variant="ghost"
      >
        <Images className="size-5" />
      </Button>
      <div className="flex-1">
        <Input
          className="bg-chat-composer-input-background-color text-primary-text rounded-full border-none ring-0 outline-none"
          placeholder="Aa"
        />
      </div>
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

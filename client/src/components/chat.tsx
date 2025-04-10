import { Images, Info, Phone, ThumbsUp, Video } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Chat = () => {
  return (
    <div className="bg-primary-background text-primary-foreground flex h-full flex-1 flex-col overflow-hidden rounded-md">
      {/* Header */}
      <div className="bg-primary-background flex flex-initial justify-between px-4 py-3 shadow">
        <div className="flex items-center gap-2">
          <div className="relative size-10">
            <Image
              src="/thumbnail.jpg"
              alt=""
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h2>Chanotai Krajeam</h2>
            <p className="text-secondary-text text-xs">Active 3h ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="text-primary-icon rounded-full"
            variant="ghost"
          >
            <Phone className="size-5" />
          </Button>
          <Button
            size="icon"
            className="text-primary-icon rounded-full"
            variant="ghost"
          >
            <Video className="size-5" />
          </Button>
          <Button
            size="icon"
            className="text-primary-icon rounded-full"
            variant="ghost"
          >
            <Info className="size-5" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Chat messages go here */}
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            Hey there!
          </div>
          <div className="rounded bg-white p-2 text-black shadow">
            What's up?
          </div>
        </div>
      </div>

      {/* Message Input */}
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
    </div>
  )
}

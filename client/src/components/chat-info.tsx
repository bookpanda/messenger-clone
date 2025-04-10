import { Lock } from "lucide-react"
import Image from "next/image"

export const ChatInfo = () => {
  return (
    <div className="bg-primary-background text-primary-foreground w-75 space-y-5 rounded-md px-3 py-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative size-20">
          <Image
            src="/thumbnail.jpg"
            alt=""
            className="rounded-full object-cover"
            fill
          />
        </div>
        <h2 className="font-medium">Chanotai Krajeam</h2>
      </div>
      <div className="flex justify-center">
        <div className="bg-chat-composer-input-background-color text-primary-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
          <Lock className="size-3" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  )
}

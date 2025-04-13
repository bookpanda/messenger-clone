import { Dispatch, SetStateAction } from "react"

import { useChatContext } from "@/contexts/chat-context"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Info, Phone, Video } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime)

interface ChatHeaderProps {
  name: string
  image: string
  lastActive: Date
  setOpenChatInfo: Dispatch<SetStateAction<boolean>>
}

export const ChatHeader = (props: ChatHeaderProps) => {
  const { name, image, lastActive, setOpenChatInfo } = props

  const { data: session } = useSession()
  const { currentChat } = useChatContext()
  const { is_direct, participants } = currentChat

  let chatName = name
  let chatImage = image
  if (is_direct) {
    const members = participants.filter(
      (participant) => participant.id !== session?.user?.userId
    )
    chatName = members[0]?.name || ""
    chatImage = members[0]?.profilePictureUrl || ""
  }

  const lastActiveTime = dayjs(lastActive).from(dayjs())

  return (
    <div className="bg-primary-background flex flex-initial justify-between px-4 py-3 shadow">
      <div className="flex items-center gap-2">
        <div className="relative size-10">
          <Image
            src={chatImage}
            alt=""
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2>{chatName}</h2>
          <p className="text-secondary-text text-xs">Active {lastActiveTime}</p>
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
          onClick={() => setOpenChatInfo((prev) => !prev)}
        >
          <Info className="size-5" />
        </Button>
      </div>
    </div>
  )
}

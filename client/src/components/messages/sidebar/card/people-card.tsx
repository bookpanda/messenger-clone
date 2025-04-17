import { createChatAction } from "@/actions/chat/create-chat"
import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import { User } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface PeopleCardProps {
  friend: User
}

export const PeopleCard = ({ friend }: PeopleCardProps) => {
  const { setTab } = useChatStore()
  const { setChatList } = useChatStore()

  const queryClient = useQueryClient()

  const handleAddFriend = async () => {
    try {
      await createChatAction({
        friendId: friend.id,
      })
      await queryClient.invalidateQueries({
        queryKey: ["people"],
      })

      setTab("inbox")

      const chatList = await getMyChatsAction()
      setChatList(chatList)

      toast.success("Chat created successfully")
    } catch {
      toast.error("Failed to create chat")
    }
  }

  return (
    <div className="item-center flex gap-4 rounded-md p-2">
      <div className="relative size-14">
        <Image
          src={friend.profilePictureUrl || ""}
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <h2>{friend.name}</h2>
        <div className="text-secondary-text flex items-center gap-1 text-xs"></div>
      </div>
      <div className="flex items-center justify-center">
        <Button size="icon" className="rounded-full" onClick={handleAddFriend}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}

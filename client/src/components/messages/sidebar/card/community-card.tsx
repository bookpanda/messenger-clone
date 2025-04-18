import { joinChatAction } from "@/actions/chat/join-chat"
import { useChatStore } from "@/stores/chat"
import { User } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { Check, PlusIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export const CommunityCard = ({
  id,
  name,
  image,
  participants,
  isMember,
}: {
  id: number
  name: string
  image: string
  participants: User[]
  isMember: boolean
}) => {
  const { setTab } = useChatStore()

  const queryClient = useQueryClient()

  const handleJoinChat = async () => {
    try {
      await joinChatAction(id)
      await queryClient.invalidateQueries({
        queryKey: ["community-chats"],
      })

      setTab("inbox")

      toast.success(`Successfully joined ${name}.`)
    } catch {
      toast.error("Failed to join chat")
    }
  }
  return (
    <div className="item-center flex gap-4 rounded-md p-2">
      <div className="relative size-14">
        <Image
          src={image || "/thumbnail.jpg"}
          alt={name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <h2>{name}</h2>
        <div className="flex">
          {participants.slice(0, 5).map((participant) => (
            <div
              key={participant.id + participant.email}
              className="border-primary-background relative size-5 border-2"
            >
              <Image
                src={participant.profilePictureUrl || "/thumbnail.jpg"}
                alt={participant.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ))}
          {participants.length > 5 && (
            <p className="text-secondary-text flex items-center gap-1 text-xs">
              +{participants.length - 5}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {isMember ? (
          <div className="bg-secondary-background flex size-9 items-center justify-center rounded-full text-green-500">
            <Check className="size-4" />
          </div>
        ) : (
          <Button size="icon" className="rounded-full" onClick={handleJoinChat}>
            <PlusIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

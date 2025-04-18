import { FormEvent, useState } from "react"

import { changeNickname } from "@/actions/chat/change-nickname"
import { Participant } from "@/types"
import { Check, PenLine } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const ChangeNicknameCard = ({
  chatId,
  participant,
}: {
  chatId: number
  participant: Participant
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const [nickname, setNickname] = useState(participant.nickname)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await changeNickname({
        chatId,
        participantId: participant.id,
        nickname,
      })

      toast.success("Nickname changed successfully")
    } catch {
      toast.error("Failed to change nickname")
    }

    setIsEditing(false)
  }

  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-md p-4 transition active:bg-white/20"
      onClick={() => setIsEditing((prev) => !prev)}
    >
      <div className="relative size-12">
        <Image
          src={participant.profilePictureUrl}
          alt={participant.name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      {!isEditing ? (
        <div className="flex flex-1 gap-4">
          <div className="flex-1">
            <p className="line-clamp-1 font-bold">
              {participant.nickname ? participant.nickname : participant.name}
            </p>
            <p className="text-xs text-gray-300">
              {participant.nickname ? participant.name : "Set nickname"}
            </p>
          </div>
          <div>
            <Button
              type="button"
              size="icon"
              className="bg-primary-background rounded-full hover:bg-white/20"
            >
              <PenLine className="size-5" />
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-1 gap-4"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1">
            <Input
              placeholder={participant.name}
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
            />
          </div>
          <div>
            <Button
              size="icon"
              className="bg-primary-background rounded-full hover:bg-white/20"
              type="submit"
            >
              <Check className="size-5" />
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

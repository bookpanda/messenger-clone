import { Participant } from "@/types"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ChangeNicknameCard } from "./change-nickname-card"

export const ChangeNickname = ({
  chatId,
  participants,
}: {
  chatId: number
  participants: Participant[]
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
        >
          <span className="font-light">Aa</span>
          <span>Edit nicknames</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-background gap-0 border-none p-0 text-white sm:max-w-[425px]">
        <DialogHeader className="border-b border-white/10 p-4">
          <DialogTitle className="text-center text-lg font-bold">
            Nicknames
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 p-6">
          {participants.map((participant) => (
            <ChangeNicknameCard
              key={participant.id + "-change-nickname"}
              chatId={chatId}
              participant={participant}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

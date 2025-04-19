import { FormEvent, useState } from "react"

import { changeChatName } from "@/actions/chat/change-name"
import { useChatStore } from "@/stores/chat"
import { Pen } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export const ChangeChatName = ({
  chatId,
  initialName,
}: {
  chatId: number
  initialName: string
}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string>(initialName)
  const { changeChatListName } = useChatStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await changeChatName({
        chatId,
        name,
      })

      changeChatListName(chatId, name)

      toast.success("Chat name changed successfully")
    } catch {
      toast.error("Failed to change chat name")
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
        >
          <Pen className="size-5" />
          <span>Change Name</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-background gap-0 border-none p-0 text-white sm:max-w-[425px]">
        <DialogHeader className="border-b border-white/10 p-4">
          <DialogTitle className="text-center text-lg font-bold">
            Change Name
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <Input
              placeholder="Group Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-chat-incoming-message-bubble-background-color w-full"
            >
              Cancel
            </Button>
            <Button className="bg-chat-outgoing-message-bubble-background-color w-full">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { FormEvent, useState } from "react"

import { changeChatColor } from "@/actions/chat/change-color"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ColorCard } from "./color-card"

const colorOptions = [
  { name: "Classic", color: "#0e92eb" },
  { name: "Default", color: "#3d61ff" },
  { name: "Grape", color: "#A80DDD" },
  { name: "Ocean", color: "#4E42AD" },
  { name: "Kiwi", color: "#96C90C" },
  { name: "Honey", color: "#E6A50E" },
]

export const ChangeColor = ({
  chatId,
  initialColor,
}: {
  chatId: number
  initialColor: string
}) => {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(initialColor)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await changeChatColor({
        chatId,
        color,
      })

      toast.success("Chat color changed successfully")
    } catch {
      toast.error("Failed to change chat color")
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
          <div
            className="relative size-5 rounded-full"
            style={{ background: initialColor }}
          >
            <div className="bg-primary-background absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full"></div>
          </div>
          <span>Change themes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-background gap-0 border-none p-0 text-white sm:max-w-[425px]">
        <DialogHeader className="border-b border-white/10 p-4">
          <DialogTitle className="text-center text-lg font-bold">
            Color
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="flex flex-wrap justify-center gap-6">
            {colorOptions.map((option) => (
              <ColorCard
                key={option.name}
                color={option.color}
                isActive={color === option.color}
                onClick={(e) => {
                  e.preventDefault()
                  setColor(option.color)
                }}
              />
            ))}
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
              Select
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

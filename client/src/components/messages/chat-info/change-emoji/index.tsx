import { FormEvent, useState } from "react"

import { cn } from "@/lib/utils"
import { Participant } from "@/types"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const smiley = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🥸",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
]

const people = [
  "👋",
  "🤚",
  "🖐️",
  "✋",
  "🖖",
  "👌",
  "🤌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝️",
  "👍",
  "👎",
  "✊",
  "👊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🙏",
  "✍️",
  "💅",
  "🤳",
]

const heart = [
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "💌",
]

const food = [
  "🍏",
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🍆",
  "🥑",
  "🥦",
  "🥬",
  "🥒",
  "🌶️",
  "🫑",
  "🌽",
  "🥕",
  "🫒",
  "🧄",
  "🧅",
  "🥔",
  "🍠",
  "🍞",
  "🥐",
  "🥖",
  "🫓",
  "🥨",
  "🥯",
  "🥞",
  "🧇",
  "🧀",
  "🍖",
  "🍗",
  "🥩",
  "🥓",
  "🍔",
  "🍟",
  "🍕",
  "🌭",
  "🥪",
  "🌮",
  "🌯",
  "🫔",
  "🥙",
  "🧆",
  "🥚",
]

const animal = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🙈",
  "🙉",
  "🙊",
  "🐒",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🐣",
  "🐥",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
]

const object = [
  "💡",
  "📱",
  "💻",
  "🖥️",
  "📷",
  "🎥",
  "🎧",
  "🎮",
  "📚",
  "📦",
  "📌",
  "📍",
  "✏️",
  "🖊️",
  "📝",
  "🔒",
  "🔓",
  "🔑",
  "🗝️",
  "🛡️",
  "🚪",
  "🛏️",
  "🪑",
  "🚿",
]

const emojiOptions = [
  ...smiley,
  ...people,
  ...heart,
  ...food,
  ...animal,
  ...object,
]

export const ChangeEmoji = ({
  chatId,
  initialEmoji,
}: {
  chatId: number
  initialEmoji: string
}) => {
  const [open, setOpen] = useState(false)
  const [emoji, setEmoji] = useState<string>(initialEmoji)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    console.log("Selected color:", emoji)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
        >
          <span className="text-xl">🤩</span>
          <span>Change emoji</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-background gap-0 border-none p-0 text-white sm:max-w-[425px]">
        <DialogHeader className="border-b border-white/10 p-4">
          <DialogTitle className="text-center text-lg font-bold">
            Emoji
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="flex max-h-64 flex-wrap justify-center gap-6 overflow-y-auto">
            {emojiOptions.map((option) => (
              <div
                key={option}
                className={cn("cursor-pointer text-2xl", {
                  "bg-chat-outgoing-message-bubble-background-color rounded-lg":
                    emoji == option,
                })}
                onClick={() => setEmoji(option)}
              >
                {option}
              </div>
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

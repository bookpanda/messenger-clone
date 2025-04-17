import { FormEvent, useState } from "react"

import { createChatGroupAction } from "@/actions/chat/create-group-chat"
import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import { User } from "@/types"
import { SquarePen } from "lucide-react"
import Image from "next/image"
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
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"

export const CreateGroup = ({ allUsers }: { allUsers: User[] }) => {
  const [open, setOpen] = useState(false)
  const { setTab } = useChatStore()

  const userList = allUsers.map((user) => ({
    value: user.id.toString(),
    label: user.name,
    icon: (
      <div className="relative size-8">
        <Image
          src={user.profilePictureUrl}
          alt={user.name}
          fill
          className="rounded-full object-cover"
        />
      </div>
    ),
  }))

  const [name, setName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createChatGroupAction({
        name,
        participantIds: selectedUsers,
      })

      setTab("inbox")
      const chatList = await getMyChatsAction()
      useChatStore.setState({ chatList })

      setOpen(false)
      setName("")
      setSelectedUsers([])
      toast.success("Chat created successfully")
    } catch {
      toast.error("Failed to create chat")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="size-10 rounded-full bg-white/10 hover:bg-white/20"
          size="icon"
        >
          <SquarePen className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary-background border-none text-white">
        <DialogHeader>
          <DialogTitle>New Group</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="members">Members</Label>
            <MultiSelect
              id="members"
              options={userList}
              onValueChange={setSelectedUsers}
              value={selectedUsers}
              placeholder="Select frameworks"
              variant="inverted"
            />
          </div>
          <div className="flex justify-end">
            <Button>Create Group</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

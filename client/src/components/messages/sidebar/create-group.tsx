import { useState } from "react"

import { User } from "@/types"
import { SquarePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MultiSelect } from "@/components/ui/multi-select"

export const CreateGroup = ({ allUsers }: { allUsers: User[] }) => {
  const userList = allUsers.map((user) => ({
    value: user.id.toString(),
    label: user.name,
  }))

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  return (
    <Dialog>
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
        <div className="flex flex-col gap-4">
          <MultiSelect
            options={userList}
            onValueChange={setSelectedUsers}
            value={selectedUsers}
            placeholder="Select frameworks"
            variant="inverted"
          />
          <div className="flex justify-end">
            <Button>Create Group</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

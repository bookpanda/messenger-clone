import { Icon } from "@iconify/react"

import { ProfilePicture } from "./profile-picture"

export const Header = () => {
  return (
    <div className="bg-primary-background text-primary-foreground flex-initial border-b border-white/20 px-4">
      <div className="flex items-center justify-between py-2">
        <div className="size-10">
          <Icon icon="logos:facebook" className="size-full" />
        </div>
        <ProfilePicture />
      </div>
    </div>
  )
}

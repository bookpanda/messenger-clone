import { useEffect, useRef, useState } from "react"

import { Icon } from "@iconify/react"

import { ProfileMenu } from "./profile-menu"
import { ProfilePicture } from "./profile-picture"

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className="bg-primary-background text-primary-foreground flex-initial border-b border-white/20 px-4">
      <div className="flex items-center justify-between py-2" ref={menuRef}>
        <div className="size-10">
          <Icon icon="logos:facebook" className="size-full" />
        </div>
        <ProfilePicture onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
      {isMenuOpen && <ProfileMenu />}
    </div>
  )
}

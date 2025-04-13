import { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

interface CardProps extends PropsWithChildren {
  isActive: boolean
  onClick?: () => void
}

export const BaseCard = ({ isActive, onClick, children }: CardProps) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-white/10",
        {
          "bg-card-selected-background/20 hover:bg-card-selected-background/20":
            isActive,
        }
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

import { cn } from "@/lib/utils"

export const ColorCard = ({
  color,
  isActive,
  onClick,
}: {
  color: string
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <button
      className={cn("relative size-12 cursor-pointer rounded-full", {
        "ring-offset-primary-background ring-2 ring-white ring-offset-2":
          isActive,
      })}
      style={{
        background: color,
      }}
      onClick={onClick}
    >
      <div className="bg-primary-background absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full"></div>
    </button>
  )
}

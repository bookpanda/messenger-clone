import { PropsWithChildren } from "react"

interface TabButtonProps extends PropsWithChildren {
  isActive: boolean
  onClick: () => void
}

export const TabButton = ({ isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-md rounded-full px-3 py-1.5 font-medium ${
        isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
      }`}
    >
      {children}
    </button>
  )
}

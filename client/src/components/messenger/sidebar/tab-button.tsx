import { PropsWithChildren } from "react"

interface TabButtonProps extends PropsWithChildren {
  isActive: boolean
  onClick: () => void
}

export const TabButton = ({ isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-md cursor-pointer rounded-full px-3 py-1.5 font-bold transition-colors ${
        isActive
          ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
          : "text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  )
}

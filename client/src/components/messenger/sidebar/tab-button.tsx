import { PropsWithChildren } from "react"

interface TabButtonProps extends PropsWithChildren {
  isActive: boolean
  onClick: () => void
}

export const TabButton = ({ isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-md cursor-pointer rounded-full px-3 py-1.5 font-bold hover:bg-white/10 ${
        isActive && "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20"
      }`}
    >
      {children}
    </button>
  )
}

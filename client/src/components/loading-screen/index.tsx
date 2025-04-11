import { Icon } from "@iconify/react"

export const LoadingScreen = () => {
  return (
    <div className="bg-primary-background text-primary-foreground h-screen w-screen">
      <div className="flex h-[85%] items-center justify-center py-2">
        <div className="size-20">
          <Icon icon="logos:facebook" className="size-full" />
        </div>
      </div>

      <div className="flex h-[15%] flex-col items-center justify-center">
        <p className="text-secondary-text">from</p>
        <div className="flex items-center gap-1 rounded-full text-lg font-medium text-blue-500">
          <Icon icon="mingcute:meta-line" className="size-7" />
          <p>Meta</p>
        </div>
      </div>
    </div>
  )
}

import { ArrowRight, Play } from "lucide-react"
import type { ReactNode } from "react"

export interface ActionButtonProps {
  label: ReactNode
  onClick: () => void
}

export function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button
      className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-white sm:px-5 sm:py-4"
      onClick={onClick}
    >
      <div className="flex flex-row gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
          <Play size={20} />
        </div>
        {label}
      </div>
      <ArrowRight size={20} />
    </button>
  )
}

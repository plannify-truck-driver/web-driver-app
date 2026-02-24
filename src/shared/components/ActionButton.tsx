import { ArrowRight, Play } from "lucide-react"
import type { ReactNode } from "react"
import { Loader } from "./Loader"

export interface ActionButtonProps {
  label: ReactNode
  isLoading: boolean
  onClick: () => void
}

export function ActionButton({ label, isLoading, onClick }: ActionButtonProps) {
  return (
    <button
      className={
        "bg-primary flex w-full flex-row items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-white sm:px-5 sm:py-4" +
        (isLoading ? " cursor-not-allowed opacity-50" : " hover:bg-primary/90 cursor-pointer")
      }
      onClick={onClick}
      disabled={isLoading}
    >
      <div className="flex flex-row gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
          <Play size={20} />
        </div>
        {label}
      </div>
      {isLoading ? <Loader size={6} /> : <ArrowRight size={20} />}
    </button>
  )
}

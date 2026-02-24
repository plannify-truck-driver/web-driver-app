import { X } from "lucide-react"
import type { ReactNode } from "react"
import { Loader } from "./Loader"
import { cn } from "@/lib/utils"

export interface UndoButtonProps {
  label: ReactNode
  className?: string
  isLoading: boolean
  onClick: () => void
}

export function UndoButton({ label, className, isLoading, onClick }: UndoButtonProps) {
  return (
    <button
      className={cn(
        "animate-push-in hover:border-border flex w-full flex-row items-center justify-between rounded-lg border border-transparent px-2 py-3 text-sm font-semibold",
        isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      <div className="flex flex-row gap-4">{label}</div>
      {isLoading ? <Loader size={6} /> : <X size={20} />}
    </button>
  )
}

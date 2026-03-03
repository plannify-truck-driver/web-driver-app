import { ChevronLeft, ChevronRight } from "lucide-react"

export interface PeriodSelectorProps {
  label: string
  subLabel?: string
  onPrevious: () => void
  onNext: () => void
}

export function PeriodSelector({ label, subLabel, onPrevious, onNext }: PeriodSelectorProps) {
  return (
    <div className="w-full sm:w-auto">
      <div className="hidden items-center justify-between gap-4 sm:flex">
        <button onClick={onPrevious} className="border-border cursor-pointer rounded-md border p-2">
          <ChevronLeft size={12} className="text-muted-foreground" />
        </button>
        <p className="text-sm">{label}</p>
        <button onClick={onNext} className="border-border cursor-pointer rounded-md border p-2">
          <ChevronRight size={12} className="text-muted-foreground" />
        </button>
      </div>
      <div className="border-border bg-sidebar flex w-full items-center justify-between rounded-lg border sm:hidden">
        <button
          onClick={onPrevious}
          className="flex w-full max-w-16 cursor-pointer items-center justify-center self-stretch"
        >
          <ChevronLeft size={14} className="text-muted-foreground" />
        </button>
        <div className="flex flex-col items-center py-3">
          <p className="text-sm font-semibold">{label}</p>
          {subLabel && <p className="text-muted-foreground text-xs">{subLabel}</p>}
        </div>
        <button
          onClick={onNext}
          className="flex w-full max-w-16 cursor-pointer items-center justify-center self-stretch"
        >
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

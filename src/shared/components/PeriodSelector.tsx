import { ChevronLeft, ChevronRight } from "lucide-react"

export interface PeriodSelectorProps {
  label: string
  onPrevious: () => void
  onNext: () => void
}

export function PeriodSelector({ label, onPrevious, onNext }: PeriodSelectorProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div onClick={onPrevious} className="border-border cursor-pointer rounded-md border p-2">
        <ChevronLeft size={20} className="text-muted-foreground" />
      </div>
      <p>{label}</p>
      <div onClick={onNext} className="border-border cursor-pointer rounded-md border p-2">
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>
    </div>
  )
}

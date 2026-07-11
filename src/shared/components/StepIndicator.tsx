import { cn } from "@/lib/utils"

export function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex w-full items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            i + 1 <= current ? "bg-primary" : "bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

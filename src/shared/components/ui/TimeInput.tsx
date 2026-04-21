import { useRef } from "react"
import { ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeInputProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  "aria-invalid"?: boolean
  className?: string
}

function TimeInput({
  id,
  value,
  onChange,
  disabled,
  "aria-invalid": ariaInvalid,
  className,
}: TimeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (disabled) return
    try {
      inputRef.current?.showPicker()
    } catch {
      inputRef.current?.focus()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "border-input dark:bg-input/30 relative flex w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 shadow-xs transition-[color,box-shadow]",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 px-4 py-3 has-[input:focus-visible]:ring-[3px]",
        ariaInvalid && "ring-destructive/20 dark:ring-destructive/40 border-destructive",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className={cn("text-lg", !value && "text-muted-foreground")}>{value || "--:--"}</span>
      <ClockIcon className="text-muted-foreground size-4 shrink-0" />
      <input
        ref={inputRef}
        id={id}
        type="time"
        value={value ?? ""}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        onChange={(e) => onChange?.(e.target.value)}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  )
}

export { TimeInput }

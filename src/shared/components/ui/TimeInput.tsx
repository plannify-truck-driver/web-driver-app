import { useEffect, useRef, useState } from "react"
import { ClockIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useShowSeconds } from "@/hooks/use-show-seconds"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))
const SECONDS = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

interface TimeInputProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean
  className?: string
}

function TimeInput({
  id,
  value,
  onChange,
  disabled,
  clearable = false,
  "aria-invalid": ariaInvalid,
  className,
}: TimeInputProps) {
  const [open, setOpen] = useState(false)
  const { showSeconds } = useShowSeconds()

  const parts = value ? value.split(":") : []
  const selectedHour = parts[0] ?? null
  const selectedMinute = parts[1] ?? null
  const selectedSecond = parts[2] ?? null

  const hourListRef = useRef<HTMLDivElement>(null)
  const minuteListRef = useRef<HTMLDivElement>(null)
  const secondListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const timeout = setTimeout(() => {
      if (selectedHour) {
        hourListRef.current
          ?.querySelector<HTMLElement>(`[data-hour="${selectedHour}"]`)
          ?.scrollIntoView({ block: "center", behavior: "instant" })
      }
      if (selectedMinute) {
        minuteListRef.current
          ?.querySelector<HTMLElement>(`[data-minute="${selectedMinute}"]`)
          ?.scrollIntoView({ block: "center", behavior: "instant" })
      }
      if (showSeconds && selectedSecond) {
        secondListRef.current
          ?.querySelector<HTMLElement>(`[data-second="${selectedSecond}"]`)
          ?.scrollIntoView({ block: "center", behavior: "instant" })
      }
    }, 50)
    return () => clearTimeout(timeout)
  }, [open])

  const displayValue = () => {
    if (!value) return null
    if (showSeconds) {
      const h = selectedHour ?? "00"
      const m = selectedMinute ?? "00"
      const s = selectedSecond ?? "00"
      return `${h}:${m}:${s}`
    }
    return value.substring(0, 5)
  }

  const handleHourClick = (hour: string) => {
    const m = selectedMinute ?? "00"
    const s = selectedSecond ?? "00"
    onChange?.(showSeconds ? `${hour}:${m}:${s}` : `${hour}:${m}`)
  }

  const handleMinuteClick = (minute: string) => {
    const h = selectedHour ?? "00"
    const s = selectedSecond ?? "00"
    onChange?.(showSeconds ? `${h}:${minute}:${s}` : `${h}:${minute}`)
    if (!showSeconds) setOpen(false)
  }

  const handleSecondClick = (second: string) => {
    const h = selectedHour ?? "00"
    const m = selectedMinute ?? "00"
    onChange?.(`${h}:${m}:${second}`)
    setOpen(false)
  }

  const columnClass = "h-52 overflow-y-auto overscroll-contain p-1"
  const itemClass = (active: boolean) =>
    cn(
      "flex w-full items-center justify-center rounded px-3 py-1.5 text-sm font-medium",
      active
        ? "bg-primary text-primary-foreground dark:text-white"
        : "hover:bg-accent hover:text-accent-foreground"
    )

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <div
          id={id}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-invalid={ariaInvalid}
          aria-haspopup="listbox"
          aria-expanded={open}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className={cn(
            "border-input dark:bg-input/30 flex w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-2 shadow-xs transition-[color,box-shadow]",
            "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
            open && "border-ring ring-ring/50 ring-[3px]",
            ariaInvalid && "ring-destructive/20 dark:ring-destructive/40 border-destructive",
            disabled && "pointer-events-none cursor-not-allowed opacity-50",
            className
          )}
        >
          <span className={cn("text-lg sm:text-base", !value && "text-muted-foreground")}>
            {displayValue() ?? (showSeconds ? "--:--:--" : "--:--")}
          </span>
          {clearable && value && !disabled ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange?.("")
              }}
              className="text-muted-foreground hover:text-foreground relative z-10 cursor-pointer"
              tabIndex={-1}
            >
              <XIcon className="size-4 shrink-0" />
            </button>
          ) : (
            <ClockIcon className="text-muted-foreground size-4 shrink-0" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex divide-x">
          <div
            ref={hourListRef}
            className={columnClass}
            onWheel={(e) => e.stopPropagation()}
          >
            {HOURS.map((hour) => (
              <button
                key={hour}
                data-hour={hour}
                type="button"
                onClick={() => handleHourClick(hour)}
                className={itemClass(hour === selectedHour)}
              >
                {hour}
              </button>
            ))}
          </div>
          <div
            ref={minuteListRef}
            className={columnClass}
            onWheel={(e) => e.stopPropagation()}
          >
            {MINUTES.map((minute) => (
              <button
                key={minute}
                data-minute={minute}
                type="button"
                onClick={() => handleMinuteClick(minute)}
                className={itemClass(minute === selectedMinute)}
              >
                {minute}
              </button>
            ))}
          </div>
          {showSeconds && (
            <div
              ref={secondListRef}
              className={columnClass}
              onWheel={(e) => e.stopPropagation()}
            >
              {SECONDS.map((second) => (
                <button
                  key={second}
                  data-second={second}
                  type="button"
                  onClick={() => handleSecondClick(second)}
                  className={itemClass(second === selectedSecond)}
                >
                  {second}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TimeInput }

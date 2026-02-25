import type { Workday } from "@/shared/models/workday"
import { useTranslation } from "react-i18next"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { displayDuration } from "@/shared/functions/displayDuration"
import { ChevronRight, Minus } from "lucide-react"
import { displayTime } from "@/shared/functions/displayTime"
import { cn } from "@/lib/utils"

export interface WorkdayTableRow2Props {
  date?: Date
  workday?: Workday
  isFirst: boolean
  isLast: boolean
  onClick: () => void
}

export function WorkdayTableRow2({
  date,
  workday,
  isFirst,
  isLast,
  onClick,
}: WorkdayTableRow2Props) {
  const { t, i18n } = useTranslation()

  if (!workday && !date) {
    return null
  }

  if (!workday) {
    return (
      <div
        className={cn(
          "bg-sidebar border-border flex w-full flex-col items-start justify-center gap-2 border-x border-t px-4 py-3",
          isFirst && "rounded-tl-lg rounded-tr-lg",
          isLast && "rounded-br-lg rounded-bl-lg border-b"
        )}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-muted-foreground/80">
            {date?.toLocaleDateString(i18n.language, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Minus size={16} className="text-muted-foreground/80" />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="bg-muted-foreground/10 text-muted-foreground/80 flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Début</p>
            <Minus size={16} />
          </div>
          <div className="bg-muted-foreground/10 text-muted-foreground/80 flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Fin</p>
            <Minus size={16} />
          </div>
          <div className="bg-muted-foreground/10 text-muted-foreground/80 flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Coupure</p>
            <Minus size={16} />
          </div>
        </div>
      </div>
    )
  }

  const workdedTime = getWorkingTime(workday.start_time, workday.end_time, workday.rest_time)

  return (
    <button
      className={cn(
        "bg-sidebar border-border flex w-full cursor-pointer flex-col items-start justify-center gap-2 border-x border-t px-4 py-3",
        isFirst && "rounded-tl-lg rounded-tr-lg",
        isLast && "rounded-br-lg rounded-bl-lg border-b"
      )}
      onClick={onClick}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <p>
          {date?.toLocaleDateString(i18n.language, {
            weekday: "short",
            month: "short",
            day: "numeric",
          }) ??
            new Date(workday.date).toLocaleDateString(i18n.language, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
        </p>
        <div className="flex flex-row items-center gap-2">
          <p>
            {displayDuration(
              `${Math.floor(workdedTime / 3600)}:${Math.floor((workdedTime % 3600) / 60)}`,
              t
            )}
          </p>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="bg-primary/10 text-primary flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
          <p>Début</p>
          <p>{displayTime(workday.start_time)}</p>
        </div>
        {workday.end_time ? (
          <div className="bg-primary/10 text-primary flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Fin</p>
            <p>{displayTime(workday.end_time)}</p>
          </div>
        ) : (
          <div className="bg-muted-foreground/10 text-muted-foreground/80 flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Fin</p>
            <Minus size={16} />
          </div>
        )}
        {workday.end_time ? (
          <div className="bg-success/10 text-success flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Coupure</p>
            <p>{displayDuration(workday.rest_time, t)}</p>
          </div>
        ) : (
          <div className="bg-muted-foreground/10 text-muted-foreground/80 flex flex-row items-center gap-1 rounded-md px-2 py-1 text-xs">
            <p>Coupure</p>
            <Minus size={16} />
          </div>
        )}
      </div>
    </button>
  )
}

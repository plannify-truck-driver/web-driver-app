import type { Workday } from "@/shared/models/workday"
import { useTranslation } from "react-i18next"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { displayDuration } from "@/shared/functions/displayDuration"
import { displayTime } from "@/shared/functions/displayTime"
import { Check, Minus } from "lucide-react"
import { useShowSeconds } from "@/hooks/use-show-seconds"
import { cn } from "@/lib/utils"

export interface WorkdayTableRow3Props {
  date?: Date
  workday?: Workday
  isFirst: boolean
  isLast: boolean
  onClick: () => void
}

export function WorkdayTableRow3({
  date,
  workday,
  isFirst,
  isLast,
  onClick,
}: WorkdayTableRow3Props) {
  const { t, i18n } = useTranslation()
  const { showSeconds } = useShowSeconds()

  if (!workday && !date) {
    return null
  }

  if (!workday) {
    return (
      <div
        className={cn(
          "bg-sidebar border-border flex w-full cursor-pointer flex-col items-start justify-center gap-2 border-x border-t px-4 py-3",
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
        <div className="grid w-full grid-cols-4 gap-2">
          <div className="flex flex-col items-start gap-1 text-xs">
            <p className="text-muted-foreground/60">Début</p>
            <Minus size={16} className="text-muted-foreground/80" />
          </div>
          <div className="flex flex-col items-start gap-1 text-xs">
            <p className="text-muted-foreground/60">Fin</p>
            <Minus size={16} className="text-muted-foreground/80" />
          </div>
          <div className="flex flex-col items-start gap-1 text-xs">
            <p className="text-muted-foreground/60">Coupure</p>
            <Minus size={16} className="text-muted-foreground/80" />
          </div>
          <div className="flex flex-col items-start gap-1 text-xs">
            <p className="text-muted-foreground/60">Nuit</p>
            <Minus size={16} className="text-muted-foreground/80" />
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
        <p className="text-primary">
          {displayDuration(
            `${Math.floor(workdedTime / 3600)}:${Math.floor((workdedTime % 3600) / 60)}`,
            t
          )}
        </p>
      </div>
      <div className="grid w-full grid-cols-4 gap-2">
        <div className="flex flex-col items-start gap-1 text-xs">
          <p className="text-muted-foreground">{t("components.workday-table-row-3.start")}</p>
          <p className="text-sm">{displayTime(workday.start_time, showSeconds)}</p>
        </div>
        <div className="flex flex-col items-start gap-1 text-xs">
          <p className="text-muted-foreground">{t("components.workday-table-row-3.end")}</p>
          {workday.end_time ? (
            <p className="text-sm">{displayTime(workday.end_time, showSeconds)}</p>
          ) : (
            <Minus size={16} className="text-muted-foreground/80" />
          )}
        </div>
        <div className="flex flex-col items-start gap-1 text-xs">
          <p className="text-muted-foreground">{t("components.workday-table-row-3.rest-period")}</p>
          {workday.end_time ? (
            <p className="text-sm">{displayDuration(workday.rest_time, t)}</p>
          ) : (
            <Minus size={16} className="text-muted-foreground/80" />
          )}
        </div>
        <div className="flex flex-col items-start gap-1 text-xs">
          <p className="text-muted-foreground">
            {t("components.workday-table-row-3.night-period")}
          </p>
          {workday.overnight_rest ? (
            <Check size={20} className="text-success" />
          ) : (
            <Minus size={20} className="text-muted-foreground" />
          )}
        </div>
      </div>
    </button>
  )
}

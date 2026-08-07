import { ArrowRight, Clock2, Play } from "lucide-react"
import { Loader } from "./Loader"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import type { Workday } from "../models/workday"
import { displayTime } from "../functions/displayTime"
import { useShowSeconds } from "@/hooks/use-show-seconds"
import { useMaxWorkdayDuration } from "@/hooks/use-max-workday-duration"

export interface ActionButtonProps {
  todayWorkday?: Workday
  className?: string
  isLoading: boolean
  isDisabled?: boolean
  onClick: () => void
}

export function ActionButton({
  todayWorkday,
  className,
  isLoading,
  isDisabled = false,
  onClick,
}: ActionButtonProps) {
  const { t, i18n } = useTranslation()
  const { maxHours } = useMaxWorkdayDuration()
  const { showSeconds } = useShowSeconds()

  const today = new Date()
  const inactive = isLoading || isDisabled

  return (
    <button
      className={cn(
        "bg-primary flex w-full flex-row items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-white sm:px-5 sm:py-4",
        inactive ? "cursor-not-allowed opacity-50" : "hover:bg-primary/90 cursor-pointer",
        className
      )}
      onClick={onClick}
      disabled={inactive}
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10">
          {!todayWorkday ? <Play size={20} /> : <Clock2 size={20} />}
        </div>
        <div className="flex min-w-0 flex-col items-start justify-between">
          {!todayWorkday ? (
            <>
              <span>{t("pages.dashboard.start-workday")}</span>
              <span className="hidden w-full text-left font-light text-white/60 sm:block">
                {isDisabled
                  ? t("pages.dashboard.workday-creation-limit-reached")
                  : `${t("pages.dashboard.no-workday-today")} - ${today.toLocaleDateString(
                      i18n.language,
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }
                    )}`}
              </span>
              <span className="block w-full text-left font-light text-white/60 sm:hidden">
                {isDisabled
                  ? t("pages.dashboard.workday-creation-limit-reached")
                  : t("pages.dashboard.no-workday-today")}
              </span>
            </>
          ) : (
            <>
              <span>{t("pages.dashboard.end-workday")}</span>
              <span className="text-left font-light text-white/60">
                {isDisabled
                  ? t("pages.dashboard.workday-end-disabled", {
                      maxHours: maxHours,
                    })
                  : t("pages.dashboard.workday-started-at", {
                      startTime: displayTime(todayWorkday.start_time, showSeconds),
                    })}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="shrink-0">{isLoading ? <Loader size={6} /> : <ArrowRight size={20} />}</div>
    </button>
  )
}

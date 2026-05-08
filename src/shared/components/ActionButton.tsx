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
      <div className="flex flex-row gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
          {!todayWorkday ? <Play size={20} /> : <Clock2 size={20} />}
        </div>
        <div className="flex flex-col items-start justify-between">
          {!todayWorkday ? (
            <>
              <span>{t("pages.dashboard.start-workday")}</span>
              <span className="hidden font-light text-white/60 sm:block">
                {t("pages.dashboard.no-workday-today")} -{" "}
                {today.toLocaleDateString(i18n.language, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span className="block font-light text-white/60 sm:hidden">
                {t("pages.dashboard.no-workday-today")}
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
      {isLoading ? <Loader size={6} /> : <ArrowRight size={20} />}
    </button>
  )
}

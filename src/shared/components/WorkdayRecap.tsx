import { Check } from "lucide-react"
import type { Workday } from "../models/workday"
import { useTranslation } from "react-i18next"
import { getWorkingTime } from "../functions/getWorkingTime"
import { displayTime } from "../functions/displayTime"
import { displayDuration } from "../functions/displayDuration"
import { useShowSeconds } from "@/hooks/use-show-seconds"

export interface WorkdayRecapProps {
  workday: Workday
}

export function WorkdayRecap({ workday }: WorkdayRecapProps) {
  const { t, i18n } = useTranslation()
  const { showSeconds } = useShowSeconds()

  const workdedTime = getWorkingTime(workday.start_time, workday.end_time, workday.rest_time)

  return (
    <div className="bg-primary flex w-full flex-col gap-4 rounded-lg p-4 text-white">
      <div className="flex flex-row gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
          <Check size={20} />
        </div>
        <div className="flex flex-col items-start justify-between py-[2px]">
          <p className="leading-none font-semibold">{t("components.workday-recap.end-workday")}</p>
          <p className="text-sm leading-none font-light text-white/60">
            {new Date(workday.date).toLocaleDateString(i18n.language, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:grid-cols-4 sm:grid-rows-1">
        <div className="flex flex-col gap-1 rounded-md bg-white/10 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-xs font-light text-white/60 uppercase">
            {t("components.workday-recap.start")}
          </p>
          <p className="font-semibold">{displayTime(workday.start_time, showSeconds)}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-white/10 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-xs font-light text-white/60 uppercase">
            {t("components.workday-recap.end")}
          </p>
          <p className="font-semibold">{displayTime(workday.end_time, showSeconds)}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-white/10 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-xs font-light text-white/60 uppercase">
            {t("components.workday-recap.rest-period")}
          </p>
          <p className="font-semibold">{displayDuration(workday.rest_time, t)}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-white/10 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-xs font-light text-white/60 uppercase">
            {t("components.workday-recap.work-period")}
          </p>
          <p className="font-semibold">
            {displayDuration(
              `${Math.floor(workdedTime / 3600)}:${Math.floor((workdedTime % 3600) / 60)}`,
              t
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

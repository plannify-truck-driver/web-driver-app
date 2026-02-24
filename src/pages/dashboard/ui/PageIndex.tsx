import type { Workday } from "@/shared/models/workday"
import { ArrowRight, Play } from "lucide-react"
import { toast } from "sonner"
import type { PeriodOfTime } from "../feature/PageIndexFeature"
import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { useTranslation } from "react-i18next"
import { StatWorkedDays } from "@/shared/components/statistics/StatWorkedDays"
import { StatTotalWorkedHours } from "@/shared/components/statistics/StatTotalWorkedHour"
import { Skeleton } from "@/shared/components/ui/Skeleton"

interface PageDashboardIndexProps {
  workdays: Workday[]
  today: Date
  todayWorkday: Workday | null
  period: PeriodOfTime
  isPeriodWorkdaysLoading: boolean
  isTodayWorkdayLoading: boolean
  error: Error | null
  totalWorkingTime: string
  onPreviousPeriod: () => void
  onNextPeriod: () => void
}

export default function PageDashboardIndex({
  workdays,
  today,
  todayWorkday,
  period,
  isPeriodWorkdaysLoading,
  isTodayWorkdayLoading,
  error,
  totalWorkingTime,
  onPreviousPeriod,
  onNextPeriod,
}: PageDashboardIndexProps) {
  const { t, i18n } = useTranslation()

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-5">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">{t("pages.dashboard.page-title")}</h1>
          <p className="text-muted-foreground hidden text-sm sm:block">
            {t("pages.dashboard.week-period", {
              from: period.from.toLocaleDateString(i18n.language, {
                day: "numeric",
                month: "long",
              }),
              to: period.to.toLocaleDateString(i18n.language, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            })}
          </p>
        </div>
        <PeriodSelector
          label={
            period.from.toLocaleDateString(i18n.language, { day: "numeric", month: "short" }) +
            " - " +
            period.to.toLocaleDateString(i18n.language, { day: "numeric", month: "short" })
          }
          onPrevious={onPreviousPeriod}
          onNext={onNextPeriod}
        />
      </div>
      {isTodayWorkdayLoading ? (
        <Skeleton className="h-18 w-full" />
      ) : todayWorkday ? (
        todayWorkday.end_time ? (
          <div>
            <p> {t("pages.dashboard.workday-ended", { endTime: todayWorkday.end_time })}</p>
          </div>
        ) : (
          <button
            className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-5 py-4 text-sm font-semibold text-white"
            onClick={() => toast.info("end workday button pressed")}
          >
            <div className="flex flex-row gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Play size={20} />
              </div>
              <div className="flex flex-col items-start justify-between">
                <span>{t("pages.dashboard.end-workday")}</span>
                <span className="font-light text-white/60">
                  {t("pages.dashboard.workday-started-at", { startTime: todayWorkday.start_time })}
                </span>
              </div>
            </div>
            <ArrowRight size={20} />
          </button>
        )
      ) : (
        <button
          className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer flex-row items-center justify-between rounded-lg px-5 py-4 text-sm font-semibold text-white"
          onClick={() => toast.info("start workday button pressed")}
        >
          <div className="flex flex-row gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
              <Play size={20} />
            </div>
            <div className="flex flex-col items-start justify-between">
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
            </div>
          </div>
          <ArrowRight size={20} />
        </button>
      )}
      <div className="flex w-full flex-col gap-3">
        <p className="text-muted-foreground block font-mono text-sm uppercase sm:hidden">
          {t("pages.dashboard.summary")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
          <StatWorkedDays workedDays={workdays.length} isLoading={isPeriodWorkdaysLoading} />
          <StatTotalWorkedHours
            totalString={totalWorkingTime}
            month={today}
            isLoading={isPeriodWorkdaysLoading}
          />
        </div>
      </div>
    </div>
  )
}

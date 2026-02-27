import type { Workday } from "@/shared/models/workday"
import type { PeriodOfTime } from "../feature/PageIndexFeature"
import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { useTranslation } from "react-i18next"
import { StatWorkedDays } from "@/shared/components/statistics/StatWorkedDays"
import { StatTotalWorkedHours } from "@/shared/components/statistics/StatTotalWorkedHour"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { ActionButton } from "@/shared/components/ActionButton"
import { WorkdayRecap } from "@/shared/components/WorkdayRecap"
import { WorkdayTable } from "@/shared/components/WorkdayTable"
import { Button } from "@/shared/components/ui/Button"
import { X } from "lucide-react"
import { StatOvernightRest } from "@/shared/components/statistics/StatOvernightRest"

interface PageDashboardIndexProps {
  workdays: Workday[]
  todayWorkday: Workday | null
  period: PeriodOfTime
  isPeriodWorkdaysLoading: boolean
  isMonthWorkdaysLoading: boolean
  isTodayWorkdayLoading: boolean
  isCreatingWorkday: boolean
  isUpdatingWorkday: boolean
  isDeletingWorkday: boolean
  error: Error | null
  totalWorkingTime: string
  onPreviousPeriod: () => void
  onNextPeriod: () => void
  onStartWorkday: () => void
  onEndWorkday: () => void
  onDeleteWorkday: () => void
}

export default function PageDashboardIndex({
  workdays,
  todayWorkday,
  period,
  isPeriodWorkdaysLoading,
  isMonthWorkdaysLoading,
  isTodayWorkdayLoading,
  isCreatingWorkday,
  isUpdatingWorkday,
  isDeletingWorkday,
  error,
  totalWorkingTime,
  onPreviousPeriod,
  onNextPeriod,
  onStartWorkday,
  onEndWorkday,
  onDeleteWorkday,
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
          <div className="flex flex-col items-end gap-2 sm:gap-0">
            <WorkdayRecap workday={todayWorkday} />
            <div className="flex flex-row items-center gap-1">
              <X className="text-muted-foreground/80" size={14} />
              <Button
                variant="link"
                className="text-muted-foreground p-0 text-xs"
                onClick={onDeleteWorkday}
              >
                {t("pages.dashboard.delete-workday")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-2 sm:gap-0">
            <ActionButton
              todayWorkday={todayWorkday}
              isLoading={isUpdatingWorkday}
              onClick={onEndWorkday}
            />
            <div className="flex flex-row items-center gap-1">
              <X className="text-muted-foreground/80" size={14} />
              <Button
                variant="link"
                className="text-muted-foreground p-0 text-xs"
                disabled={isDeletingWorkday}
                onClick={onDeleteWorkday}
              >
                {t("pages.dashboard.cancel-workday")}
              </Button>
            </div>
          </div>
        )
      ) : (
        <ActionButton isLoading={isCreatingWorkday} onClick={onStartWorkday} />
      )}
      <div className="flex w-full flex-col gap-3">
        <p className="text-muted-foreground block font-mono text-sm uppercase sm:hidden">
          {t("pages.dashboard.summary")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
          <StatWorkedDays workedDays={workdays.length} isLoading={isPeriodWorkdaysLoading} />
          <StatTotalWorkedHours
            totalString={totalWorkingTime}
            month={period.from}
            isLoading={isMonthWorkdaysLoading}
          />
          <StatOvernightRest
            workdays={workdays}
            isLoading={isPeriodWorkdaysLoading}
            className="hidden sm:flex"
          />
        </div>
      </div>
      <WorkdayTable workdays={workdays} period={period} />
    </div>
  )
}

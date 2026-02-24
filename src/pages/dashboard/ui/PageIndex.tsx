import type { Workday } from "@/shared/models/workday"
import type { PeriodOfTime } from "../feature/PageIndexFeature"
import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { useTranslation } from "react-i18next"
import { StatWorkedDays } from "@/shared/components/statistics/StatWorkedDays"
import { StatTotalWorkedHours } from "@/shared/components/statistics/StatTotalWorkedHour"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { ActionButton } from "@/shared/components/ActionButton"
import { UndoButton } from "@/shared/components/UndoButton"
import { WorkdayRecap } from "@/shared/components/WorkdayRecap"
import { WorkdayTable } from "@/shared/components/WorkdayTable"

interface PageDashboardIndexProps {
  workdays: Workday[]
  today: Date
  todayWorkday: Workday | null
  period: PeriodOfTime
  isPeriodWorkdaysLoading: boolean
  isTodayWorkdayLoading: boolean
  isCreatingWorkday: boolean
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
  today,
  todayWorkday,
  period,
  isPeriodWorkdaysLoading,
  isTodayWorkdayLoading,
  isCreatingWorkday,
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
          <WorkdayRecap workday={todayWorkday} />
        ) : (
          <div className="sm:grid sm:grid-cols-6 sm:gap-2">
            <ActionButton
              className="sm:animate-squish-back col-span-5"
              label={
                <div className="flex flex-col items-start justify-between">
                  <span>{t("pages.dashboard.end-workday")}</span>
                  <span className="font-light text-white/60">
                    {t("pages.dashboard.workday-started-at", {
                      startTime: todayWorkday.start_time,
                    })}
                  </span>
                </div>
              }
              isLoading={false}
              onClick={onEndWorkday}
            />
            <UndoButton
              className="col-span-1 hidden sm:flex"
              label={
                <div className="flex flex-col items-start justify-between">
                  <span>{t("pages.dashboard.delete-workday")}</span>
                </div>
              }
              isLoading={isDeletingWorkday}
              onClick={onDeleteWorkday}
            />
          </div>
        )
      ) : (
        <ActionButton
          label={
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
          }
          isLoading={isCreatingWorkday}
          onClick={onStartWorkday}
        />
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
      <WorkdayTable
        workdays={[
          {
            date: "2026-02-24",
            start_time: "08:00:00",
            end_time: "17:00:00",
            rest_time: "01:00:00",
            overnight_rest: false,
          },
        ]}
      />
    </div>
  )
}

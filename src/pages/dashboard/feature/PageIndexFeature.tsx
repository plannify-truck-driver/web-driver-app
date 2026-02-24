import {
  useCreateWorkday,
  useGetWorkdayByDate,
  useGetWorkdaysByPeriod,
  workdaysKeys,
} from "@/shared/queries/workday/workday.queries"
import PageDashboardIndex from "../ui/PageIndex"
import { useEffect, useMemo, useState } from "react"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export interface PeriodOfTime {
  from: Date
  to: Date
}

export default function PageDashboardIndexFeature() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  useDocumentTitle(t("navigation.dashboard.navigation-title.desktop"))

  const today: Date = useMemo(() => new Date(), [])
  const monday: Date = new Date()
  monday.setDate(today.getDate() - today.getDay() + 1)
  const sunday: Date = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const [period, setPeriod] = useState<PeriodOfTime>({
    from: monday,
    to: sunday,
  })

  const {
    data: periodWorkdays,
    isLoading: isPeriodWorkdaysLoading,
    error,
  } = useGetWorkdaysByPeriod({
    from: period.from.toISOString().split("T")[0],
    to: period.to.toISOString().split("T")[0],
    page: 1,
    limit: 100,
  })
  const { data: todayWorkday, isLoading: isTodayWorkdayLoading } = useGetWorkdayByDate({
    date: today.toISOString().split("T")[0],
  })
  const {
    mutateAsync: createWorkdayAsync,
    data: createdWorkday,
    error: createWorkdayError,
    isPending: isCreatingWorkday,
  } = useCreateWorkday()

  const onPreviousPeriod = () => {
    const newFrom = new Date(period.from)
    newFrom.setDate(newFrom.getDate() - 7)
    const newTo = new Date(period.to)
    newTo.setDate(newTo.getDate() - 7)
    setPeriod({ from: newFrom, to: newTo })
  }

  const onNextPeriod = () => {
    const newFrom = new Date(period.from)
    newFrom.setDate(newFrom.getDate() + 7)
    const newTo = new Date(period.to)
    newTo.setDate(newTo.getDate() + 7)
    setPeriod({ from: newFrom, to: newTo })
  }

  const totalWorkingTime: string = useMemo(() => {
    if (periodWorkdays && periodWorkdays.data) {
      const seconds = periodWorkdays.data.reduce(
        (acc, workday) =>
          acc + getWorkingTime(workday.start_time, workday.end_time, workday.rest_time),
        0
      )

      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)

      if (minutes > 0) {
        return t("pages.dashboard.time-format", { hours, minutes })
      } else {
        return t("pages.dashboard.time-format-short", { hours })
      }
    }
    return "0h"
  }, [periodWorkdays, t])

  const onStartWorkday = () => {
    createWorkdayAsync({
      date: today.toISOString().split("T")[0],
      start_time: new Date().toISOString().split("T")[1].split(".")[0],
      end_time: null,
      rest_time: "00:00:00",
      overnight_rest: false,
    })
  }

  useEffect(() => {
    if (createdWorkday) {
      queryClient.invalidateQueries({
        queryKey: workdaysKeys.all,
      })
    }
    if (createWorkdayError) {
      toast.error(t("pages.dashboard.workday-creation-error"))
    }
  }, [createdWorkday, createWorkdayError, queryClient, t])

  return (
    <PageDashboardIndex
      workdays={periodWorkdays?.data ?? []}
      today={today}
      todayWorkday={todayWorkday ?? null}
      period={period}
      isPeriodWorkdaysLoading={isPeriodWorkdaysLoading}
      isTodayWorkdayLoading={isTodayWorkdayLoading}
      isCreatingWorkday={isCreatingWorkday}
      error={error}
      totalWorkingTime={totalWorkingTime}
      onNextPeriod={onNextPeriod}
      onPreviousPeriod={onPreviousPeriod}
      onStartWorkday={onStartWorkday}
    />
  )
}

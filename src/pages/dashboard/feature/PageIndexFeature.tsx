import {
  useGetWorkdayByDate,
  useGetWorkdaysByPeriod,
} from "@/shared/queries/workday/workday.queries"
import PageDashboardIndex from "../ui/PageIndex"
import { useMemo, useState } from "react"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { useTranslation } from "react-i18next"

export interface PeriodOfTime {
  from: Date
  to: Date
}

export default function PageDashboardIndexFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("navigation.dashboard.navigation-title.desktop"))

  const today: Date = new Date()
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
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
    }
    return "0h"
  }, [periodWorkdays])

  return (
    <PageDashboardIndex
      workdays={periodWorkdays?.data ?? []}
      today={today}
      todayWorkday={todayWorkday ?? null}
      period={period}
      isPeriodWorkdaysLoading={isPeriodWorkdaysLoading}
      isTodayWorkdayLoading={isTodayWorkdayLoading}
      error={error}
      totalWorkingTime={totalWorkingTime}
      onNextPeriod={onNextPeriod}
      onPreviousPeriod={onPreviousPeriod}
    />
  )
}

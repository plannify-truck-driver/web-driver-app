import { useDocumentTitle } from "@/hooks/use-document-title"
import PageWorkdays from "../ui/PageWorkdays"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"
import { useGetWorkdaysByMonth } from "@/shared/queries/workday/workday.queries"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { displayDuration } from "@/shared/functions/displayDuration"

export default function PageWorkdaysFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.workdays.page-title"))

  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const { data: monthWorkdays, isLoading: isMonthWorkdaysLoading } = useGetWorkdaysByMonth({
    month: (selectedMonth.getMonth() + 1).toString().padStart(2, "0"),
    year: selectedMonth.getFullYear().toString(),
  })

  const selectedMonthSubTitle = useMemo(() => {
    const now = new Date()
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    if (
      selectedMonth.getFullYear() === now.getFullYear() &&
      selectedMonth.getMonth() === now.getMonth()
    ) {
      return "pages.workdays.current-month"
    } else if (
      selectedMonth.getFullYear() === previousMonth.getFullYear() &&
      selectedMonth.getMonth() === previousMonth.getMonth()
    ) {
      return "pages.workdays.previous-month"
    }

    return "pages.workdays.other-month"
  }, [selectedMonth])

  const maxWorkedDays = useMemo(() => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }, [selectedMonth])

  const totalWorkingTime: string = useMemo(() => {
    if (monthWorkdays) {
      const seconds = monthWorkdays.reduce(
        (acc, workday) =>
          acc + getWorkingTime(workday.start_time, workday.end_time, workday.rest_time),
        0
      )

      return displayDuration(
        `${Math.floor(seconds / 3600)}:${Math.floor((seconds % 3600) / 60)}`,
        t
      )
    }
    return "0h"
  }, [monthWorkdays, t])

  const selectPreviousMonth = () => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const selectNextMonth = () => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <PageWorkdays
      workdays={monthWorkdays || []}
      isLoading={isMonthWorkdaysLoading}
      selectedMonth={selectedMonth}
      selectedMonthSubTitle={selectedMonthSubTitle}
      maxWorkedDays={maxWorkedDays}
      totalWorkingTime={totalWorkingTime}
      onPreviousMonth={selectPreviousMonth}
      onNextMonth={selectNextMonth}
    />
  )
}

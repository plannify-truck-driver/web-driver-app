import { useDocumentTitle } from "@/hooks/use-document-title"
import PageWorkdays from "../ui/PageWorkdays"
import { useTranslation } from "react-i18next"
import { useEffect, useMemo, useState } from "react"
import { useGetWorkdaysByMonth } from "@/shared/queries/workday/workday.queries"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { displayDuration } from "@/shared/functions/displayDuration"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { addWorkdayFormSchema } from "@/shared/zod/add-workday"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetRestPeriods } from "@/shared/queries/rest-period/rest-period.queries"

export interface PageWorkdaysFeatureLoadings {
  isGetMonthWorkdaysLoading: boolean
  isGetRestPeriodsLoading: boolean
}

export default function PageWorkdaysFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.workdays.page-title"))

  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [isAddWorkdayOpen, setIsAddWorkdayOpen] = useState<boolean>(false)

  const { data: monthWorkdays, isLoading: isMonthWorkdaysLoading } = useGetWorkdaysByMonth({
    month: (selectedMonth.getMonth() + 1).toString().padStart(2, "0"),
    year: selectedMonth.getFullYear().toString(),
  })
  const { data: restPeriods, isLoading: isRestPeriodsLoading } = useGetRestPeriods()

  const addWorkdayForm = useForm<z.infer<typeof addWorkdayFormSchema>>({
    resolver: zodResolver(addWorkdayFormSchema),
    defaultValues: {
      date: new Date(),
      startTime: "",
      endTime: "",
      restTime: "",
      overnight: false,
    },
  })

  useEffect(() => {
    if (!isAddWorkdayOpen) {
      addWorkdayForm.reset()
    }
  }, [isAddWorkdayOpen, addWorkdayForm])

  const endTime = useWatch({ control: addWorkdayForm.control, name: "endTime" })
  useEffect(() => {
    if (endTime?.trim() === "") {
      addWorkdayForm.setValue("restTime", "")
    }
  }, [endTime, addWorkdayForm])

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
      restPeriods={restPeriods || []}
      loadings={{
        isGetMonthWorkdaysLoading: isMonthWorkdaysLoading,
        isGetRestPeriodsLoading: isRestPeriodsLoading,
      }}
      isAddWorkdayOpen={isAddWorkdayOpen}
      selectedMonth={selectedMonth}
      selectedMonthSubTitle={selectedMonthSubTitle}
      maxWorkedDays={maxWorkedDays}
      totalWorkingTime={totalWorkingTime}
      addWorkdayForm={addWorkdayForm}
      onPreviousMonth={selectPreviousMonth}
      onNextMonth={selectNextMonth}
      setIsAddWorkdayOpen={setIsAddWorkdayOpen}
    />
  )
}

import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { StatOvernightRest } from "@/shared/components/statistics/StatOvernightRest"
import { StatTotalWorkedHours } from "@/shared/components/statistics/StatTotalWorkedHour"
import { StatWorkedDays } from "@/shared/components/statistics/StatWorkedDays"
import { WorkdayTable } from "@/shared/components/WorkdayTable"
import { upperCaseFirstLetter } from "@/shared/functions/upperCaseFirstLetter"
import type { Workday } from "@/shared/models/workday"
import { useTranslation } from "react-i18next"

interface PageWorkdaysProps {
  workdays: Workday[]
  isLoading: boolean
  selectedMonth: Date
  selectedMonthSubTitle: string
  maxWorkedDays: number
  totalWorkingTime: string
  onPreviousMonth: () => void
  onNextMonth: () => void
}

export default function PageWorkdays({
  workdays,
  isLoading,
  selectedMonth,
  selectedMonthSubTitle,
  maxWorkedDays,
  totalWorkingTime,
  onPreviousMonth,
  onNextMonth,
}: PageWorkdaysProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <h1 className="text-2xl font-semibold">{t("pages.workdays.page-title")}</h1>
        <PeriodSelector
          label={upperCaseFirstLetter(
            selectedMonth.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })
          )}
          subLabel={t(selectedMonthSubTitle)}
          onPrevious={onPreviousMonth}
          onNext={onNextMonth}
        />
      </div>
      <div className="flex w-full flex-col gap-3">
        <p className="text-muted-foreground block font-mono text-sm uppercase sm:hidden">
          {t("pages.dashboard.summary")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
          <StatWorkedDays
            statType="month"
            workedDays={workdays.length}
            maxWorkedDays={maxWorkedDays}
            isLoading={isLoading}
          />
          <StatTotalWorkedHours
            totalString={totalWorkingTime}
            month={selectedMonth}
            isLoading={isLoading}
          />
          <StatOvernightRest workdays={workdays} isLoading={isLoading} className="hidden sm:flex" />
        </div>
      </div>
      <WorkdayTable workdays={workdays} periodType="month" />
    </div>
  )
}

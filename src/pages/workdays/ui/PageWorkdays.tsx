import { AddWorkdayButton } from "@/shared/components/AddWorkdayButton"
import { AddWorkdayDialog } from "@/shared/components/AddWorkdayDialog"
import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { StatOvernightRest } from "@/shared/components/statistics/StatOvernightRest"
import { StatTotalWorkedHours } from "@/shared/components/statistics/StatTotalWorkedHour"
import { StatWorkedDays } from "@/shared/components/statistics/StatWorkedDays"
import { Button } from "@/shared/components/ui/Button"
import { ButtonGroup } from "@/shared/components/ui/ButtonGroup"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import { WorkdayTable } from "@/shared/components/WorkdayTable"
import { upperCaseFirstLetter } from "@/shared/functions/upperCaseFirstLetter"
import type { RestPeriod } from "@/shared/models/rest-period"
import type { Workday } from "@/shared/models/workday"
import type { addWorkdayFormSchema } from "@/shared/zod/add-workday"
import { ChevronDownIcon, FileChartColumnIncreasingIcon, FileCodeIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { PageWorkdaysFeatureLoadings } from "../feature/PageWorkdaysFeature"

interface PageWorkdaysProps {
  workdays: Workday[]
  restPeriods: RestPeriod[]
  isAddWorkdayOpen: boolean
  selectedMonth: Date
  selectedMonthSubTitle: string
  maxWorkedDays: number
  totalWorkingTime: string
  addWorkdayForm: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  loadings: PageWorkdaysFeatureLoadings
  onPreviousMonth: () => void
  onNextMonth: () => void
  setIsAddWorkdayOpen: (open: boolean) => void
  onSubmitAddWorkdayForm: (values: z.infer<typeof addWorkdayFormSchema>) => void
}

export default function PageWorkdays({
  workdays,
  restPeriods,
  isAddWorkdayOpen,
  selectedMonth,
  selectedMonthSubTitle,
  maxWorkedDays,
  totalWorkingTime,
  addWorkdayForm,
  loadings,
  onPreviousMonth,
  onNextMonth,
  setIsAddWorkdayOpen,
  onSubmitAddWorkdayForm,
}: PageWorkdaysProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <h1 className="text-2xl font-semibold">{t("pages.workdays.page-title")}</h1>
        <div className="flex flex-col-reverse items-end gap-4 sm:flex-row sm:items-center">
          <ButtonGroup className="hidden sm:flex">
            <Button variant="default" onClick={() => setIsAddWorkdayOpen(true)}>
              {t("pages.workdays.buttons.add-workday")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-auto">
                <Button variant="default">
                  <ChevronDownIcon size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto max-w-70 min-w-50">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FileChartColumnIncreasingIcon />
                    {t("pages.workdays.buttons.use-excel-file")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCodeIcon />
                    {t("pages.workdays.buttons.use-csv-file")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <PeriodSelector
            label={upperCaseFirstLetter(
              selectedMonth.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })
            )}
            subLabel={t(selectedMonthSubTitle)}
            onPrevious={onPreviousMonth}
            onNext={onNextMonth}
          />
        </div>
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
            isLoading={loadings.isGetMonthWorkdaysLoading}
          />
          <StatTotalWorkedHours
            totalString={totalWorkingTime}
            month={selectedMonth}
            isLoading={loadings.isGetMonthWorkdaysLoading}
          />
          <StatOvernightRest
            workdays={workdays}
            isLoading={loadings.isGetMonthWorkdaysLoading}
            className="hidden sm:flex"
          />
        </div>
      </div>
      <WorkdayTable workdays={workdays} periodType="month" />
      <AddWorkdayButton
        isFirstWorkday={workdays.length === 0}
        onClick={() => setIsAddWorkdayOpen(true)}
        className="block sm:hidden"
      />
      <AddWorkdayDialog
        isOpen={isAddWorkdayOpen}
        setIsOpen={setIsAddWorkdayOpen}
        form={addWorkdayForm}
        restPeriods={restPeriods}
        loadings={{
          isSubmitting: loadings.isCreatingWorkday,
          isGetRestPeriodsLoading: loadings.isGetRestPeriodsLoading,
        }}
        onSubmit={onSubmitAddWorkdayForm}
      />
    </div>
  )
}

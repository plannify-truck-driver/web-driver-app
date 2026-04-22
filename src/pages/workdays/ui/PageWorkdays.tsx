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
import {
  ChevronDownIcon,
  EllipsisIcon,
  FileChartColumnIncreasingIcon,
  FileCodeIcon,
} from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { PageWorkdaysFeatureLoadings } from "../feature/PageWorkdaysFeature"
import { ImportWorkdaysFromFileDialog } from "@/shared/components/ImportWorkdaysFromFileDialog"
import { useState } from "react"

interface PageWorkdaysProps {
  workdays: Workday[]
  restPeriods: RestPeriod[]
  isAddWorkdayOpen: boolean
  isImportingWorkdaysFromFileOpen: boolean
  selectedMonth: Date
  selectedMonthSubTitle: string
  maxWorkedDays: number
  totalWorkingTime: string
  addWorkdayForm: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  addWorkdayFormErrorCode: string | null
  loadings: PageWorkdaysFeatureLoadings
  onPreviousMonth: () => void
  onNextMonth: () => void
  setIsAddWorkdayOpen: (open: boolean) => void
  setIsImportingWorkdaysFromFileOpen: (open: boolean) => void
  onSubmitAddWorkdayForm: (values: z.infer<typeof addWorkdayFormSchema>) => void
  onReplaceExistingWorkday: () => void
  onRestoreGarbageWorkday: () => void
  undoAddWorkdayFormErrorCode: () => void
}

export default function PageWorkdays({
  workdays,
  restPeriods,
  isAddWorkdayOpen,
  isImportingWorkdaysFromFileOpen,
  selectedMonth,
  selectedMonthSubTitle,
  maxWorkedDays,
  totalWorkingTime,
  addWorkdayForm,
  addWorkdayFormErrorCode,
  loadings,
  onPreviousMonth,
  onNextMonth,
  setIsAddWorkdayOpen,
  setIsImportingWorkdaysFromFileOpen,
  onSubmitAddWorkdayForm,
  onReplaceExistingWorkday,
  onRestoreGarbageWorkday,
  undoAddWorkdayFormErrorCode,
}: PageWorkdaysProps) {
  const { t, i18n } = useTranslation()
  const [importFileType, setImportFileType] = useState<"csv" | "xlsx">("xlsx")

  const openImportDialog = (type: "csv" | "xlsx") => {
    setImportFileType(type)
    setIsImportingWorkdaysFromFileOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex flex-row items-center justify-between gap-1">
          <h1 className="text-2xl font-semibold">{t("pages.workdays.page-title")}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md sm:hidden"
              >
                <EllipsisIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto max-w-70 min-w-50">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => openImportDialog("xlsx")}>
                  <FileChartColumnIncreasingIcon />
                  {t("pages.workdays.buttons.import-from-file")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                  <DropdownMenuItem onClick={() => openImportDialog("xlsx")}>
                    <FileChartColumnIncreasingIcon />
                    {t("pages.workdays.buttons.use-excel-file")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openImportDialog("csv")}>
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
      <ImportWorkdaysFromFileDialog
        isOpen={isImportingWorkdaysFromFileOpen}
        setIsOpen={setIsImportingWorkdaysFromFileOpen}
        initialFileType={importFileType}
      />
      <AddWorkdayDialog
        isOpen={isAddWorkdayOpen}
        setIsOpen={setIsAddWorkdayOpen}
        form={addWorkdayForm}
        restPeriods={restPeriods}
        loadings={{
          isSubmitting: loadings.isCreatingWorkday,
          isUpdatingWorkday: loadings.isUpdatingWorkday || loadings.isRestoringWorkday,
          isGetRestPeriodsLoading: loadings.isGetRestPeriodsLoading,
        }}
        onSubmit={onSubmitAddWorkdayForm}
        errorCode={addWorkdayFormErrorCode}
        onReplaceExistingWorkday={onReplaceExistingWorkday}
        onRestoreGarbageWorkday={onRestoreGarbageWorkday}
        undoErrorCode={undoAddWorkdayFormErrorCode}
      />
    </div>
  )
}

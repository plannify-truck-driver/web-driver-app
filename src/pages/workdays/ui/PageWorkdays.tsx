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
import { cn } from "@/lib/utils"
import { formatThousands } from "@/shared/functions/formatThousands"
import { upperCaseFirstLetter } from "@/shared/functions/upperCaseFirstLetter"
import type { RestPeriod } from "@/shared/models/rest-period"
import type { Workday } from "@/shared/models/workday"
import type { GetWorkdayCreationLimitResponse } from "@/shared/queries/workday/workday.types"
import type { addWorkdayFormSchema } from "@/shared/zod/add-workday"
import {
  ChevronDownIcon,
  FileChartColumnIncreasingIcon,
  FileCodeIcon,
  LockIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { PageWorkdaysFeatureLoadings } from "../feature/PageWorkdaysFeature"
import { ImportWorkdaysFromFileDialog } from "@/shared/components/ImportWorkdaysFromFileDialog"
import { useConfig } from "@/shared/queries/config/config.queries"
import { Link, useNavigate } from "@tanstack/react-router"

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
  isMonthDocumentGenerated: boolean
  creationLimit: GetWorkdayCreationLimitResponse | undefined
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
  isMonthDocumentGenerated,
  creationLimit,
}: PageWorkdaysProps) {
  const { t, i18n } = useTranslation()
  const { data: config } = useConfig()
  const [importFileType, setImportFileType] = useState<"csv" | "xlsx">("xlsx")

  const navigate = useNavigate()

  const creationLimitPercentage = useMemo(() => {
    if (!creationLimit || creationLimit.limit <= 0) return null
    return (creationLimit.remaining * 100) / creationLimit.limit
  }, [creationLimit])
  const isCreationLimitLow = creationLimitPercentage !== null && creationLimitPercentage <= 20
  const isCreationLimitExhausted = creationLimit?.remaining === 0

  const openImportDialog = (type: "csv" | "xlsx") => {
    setImportFileType(type)
    setIsImportingWorkdaysFromFileOpen(true)
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex flex-row items-center justify-between gap-1">
          <h1 className="text-2xl font-semibold">{t("pages.workdays.page-title")}</h1>
          {!isMonthDocumentGenerated && (
            <Button
              variant="outline"
              className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md sm:hidden"
              onClick={() => navigate({ to: "/workdays/garbage" })}
            >
              <Trash2Icon size={16} />
            </Button>
          )}
        </div>
        <div className="flex flex-col-reverse items-end gap-4 sm:flex-row sm:items-center">
          {!isMonthDocumentGenerated && (
            <>
              <ButtonGroup className="hidden sm:flex">
                <Button
                  variant="default"
                  disabled={isCreationLimitExhausted}
                  onClick={() => setIsAddWorkdayOpen(true)}
                >
                  {t("pages.workdays.buttons.add-workday")}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="h-auto">
                    <Button variant="default" disabled={isCreationLimitExhausted}>
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
              <Button
                variant="outline"
                className="text-muted-foreground flex hidden h-10 w-10 items-center justify-center rounded-md sm:flex"
                onClick={() => navigate({ to: "/workdays/garbage" })}
              >
                <Trash2Icon size={16} />
              </Button>
            </>
          )}
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
      {isMonthDocumentGenerated ? (
        <div className="flex h-full flex-col items-center justify-center gap-8 overflow-hidden text-center">
          <div className="bg-destructive/10 flex size-14 shrink-0 items-center justify-center rounded-full">
            <LockIcon className="text-destructive size-6" />
          </div>
          <div className="flex max-w-sm flex-col gap-1">
            <p className="font-semibold">{t("pages.workdays.period-locked-title")}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("pages.workdays.period-locked-description", {
                period: selectedMonth.toLocaleDateString(i18n.language, {
                  month: "long",
                  year: "numeric",
                }),
              })}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild>
              <Link
                to="/documents"
                search={{
                  year: selectedMonth.getFullYear(),
                  month: selectedMonth.getMonth() + 1,
                }}
              >
                {t("pages.workdays.period-locked-action")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={
                  "mailto:" +
                  (config ? config.support_email : "contact@plannify.be") +
                  "?subject=" +
                  encodeURIComponent(t("pages.workdays.contact-support-subject")) +
                  "&body=" +
                  encodeURIComponent(
                    t("pages.workdays.contact-support-body", {
                      period: selectedMonth.toLocaleDateString(i18n.language, {
                        month: "long",
                        year: "numeric",
                      }),
                    })
                  )
                }
              >
                {t("pages.workdays.contact-support-button")}
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {isCreationLimitLow && creationLimit && (
            <div
              className={cn(
                "relative overflow-hidden rounded-xl border bg-gradient-to-br p-5",
                isCreationLimitExhausted
                  ? "from-destructive/5 to-destructive/10"
                  : "from-amber-500/5 to-amber-500/10"
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full",
                    isCreationLimitExhausted ? "bg-destructive/10" : "bg-amber-500/10"
                  )}
                >
                  <TriangleAlertIcon
                    className={cn(
                      "size-5",
                      isCreationLimitExhausted ? "text-destructive" : "text-amber-500"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {t(
                      isCreationLimitExhausted
                        ? "pages.workdays.creation-limit-banner.exhausted-title"
                        : "pages.workdays.creation-limit-banner.low-title"
                    )}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    {t(
                      isCreationLimitExhausted
                        ? "pages.workdays.creation-limit-banner.exhausted-description"
                        : "pages.workdays.creation-limit-banner.low-description"
                    )}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          (creationLimitPercentage ?? 0) <= 10 ? "bg-red-500" : "bg-amber-500"
                        )}
                        style={{ width: `${Math.max(creationLimitPercentage ?? 0, 2)}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
                      {formatThousands(creationLimit.remaining)}/
                      {formatThousands(creationLimit.limit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            disabled={isCreationLimitExhausted}
            className="block sm:hidden"
          />
        </>
      )}
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
        creationLimit={
          creationLimit && isCreationLimitLow
            ? {
                response: creationLimit,
                percentage: creationLimitPercentage ?? 0,
              }
            : null
        }
        onSubmit={onSubmitAddWorkdayForm}
        errorCode={addWorkdayFormErrorCode}
        onReplaceExistingWorkday={onReplaceExistingWorkday}
        onRestoreGarbageWorkday={onRestoreGarbageWorkday}
        undoErrorCode={undoAddWorkdayFormErrorCode}
      />
    </div>
  )
}

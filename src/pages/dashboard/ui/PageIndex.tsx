import type { Workday } from "@/shared/models/workday"
import type { PeriodOfTime } from "../feature/PageIndexFeature"
import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { useTranslation } from "react-i18next"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { endWorkdayRestSchema } from "@/shared/zod/end-workday-rest"
import { EndWorkdayRestDialog } from "../../../shared/components/EndWorkdayRestDialog"
import { StatWorkedDays } from "@/shared/components/statistics/StatWorkedDays"
import { StatTotalWorkedHours } from "@/shared/components/statistics/StatTotalWorkedHour"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { ActionButton } from "@/shared/components/ActionButton"
import { WorkdayRecap } from "@/shared/components/WorkdayRecap"
import { WorkdayTable } from "@/shared/components/WorkdayTable"
import { Button } from "@/shared/components/ui/Button"
import { Link } from "@tanstack/react-router"
import { CoffeeIcon, X } from "lucide-react"
import { StatOvernightRest } from "@/shared/components/statistics/StatOvernightRest"

interface PageDashboardIndexProps {
  workdays: Workday[]
  todayWorkday: Workday | null
  period: PeriodOfTime
  isPeriodWorkdaysLoading: boolean
  isMonthWorkdaysLoading: boolean
  isTodayWorkdayLoading: boolean
  showRestPeriodSuggestion: boolean
  onDismissRestPeriodSuggestion: () => void
  isCreatingWorkday: boolean
  isUpdatingWorkday: boolean
  isDeletingWorkday: boolean
  error: Error | null
  totalWorkingTime: string
  onPreviousPeriod: () => void
  onNextPeriod: () => void
  canEndWorkday: boolean
  onStartWorkday: () => void
  onEndWorkday: () => void
  onDeleteWorkday: () => void
  isEndWorkdayRestDialogOpen: boolean
  endWorkdayRestForm: UseFormReturn<z.infer<typeof endWorkdayRestSchema>>
  onEndWorkdayRestDialogClose: () => void
  onConfirmEndWorkday: (values: z.infer<typeof endWorkdayRestSchema>) => void
}

export default function PageDashboardIndex({
  workdays,
  todayWorkday,
  period,
  isPeriodWorkdaysLoading,
  isMonthWorkdaysLoading,
  isTodayWorkdayLoading,
  showRestPeriodSuggestion,
  onDismissRestPeriodSuggestion,
  isCreatingWorkday,
  isUpdatingWorkday,
  isDeletingWorkday,
  error,
  totalWorkingTime,
  onPreviousPeriod,
  onNextPeriod,
  canEndWorkday,
  onStartWorkday,
  onEndWorkday,
  onDeleteWorkday,
  isEndWorkdayRestDialogOpen,
  endWorkdayRestForm,
  onEndWorkdayRestDialogClose,
  onConfirmEndWorkday,
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
              isDisabled={!canEndWorkday}
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
          <StatWorkedDays
            statType="week"
            workedDays={workdays.length}
            maxWorkedDays={7}
            isLoading={isPeriodWorkdaysLoading}
          />
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
      {showRestPeriodSuggestion && (
        <div className="from-primary/5 to-primary/10 relative overflow-hidden rounded-xl border bg-gradient-to-br p-5">
          <CoffeeIcon className="text-primary/8 absolute -right-3 -bottom-3 size-24 rotate-12" />
          <button
            onClick={onDismissRestPeriodSuggestion}
            className="text-muted-foreground/60 hover:text-muted-foreground absolute top-3 right-3 cursor-pointer rounded p-0.5 transition-colors"
            aria-label={t("pages.dashboard.suggest-configure-rest-dismiss")}
          >
            <X size={14} />
          </button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full">
              <CoffeeIcon className="text-primary size-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{t("pages.dashboard.suggest-configure-rest-title")}</p>
              <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                {t("pages.dashboard.suggest-configure-rest-description")}
              </p>
            </div>
            <Button size="sm" className="w-fit shrink-0" asChild>
              <Link to="/settings/rest-preferences">
                {t("pages.dashboard.suggest-configure-rest-action")}
              </Link>
            </Button>
          </div>
        </div>
      )}
      <WorkdayTable workdays={workdays} periodType="week" period={period} />
      <EndWorkdayRestDialog
        isOpen={isEndWorkdayRestDialogOpen}
        form={endWorkdayRestForm}
        onClose={onEndWorkdayRestDialogClose}
        onSubmit={onConfirmEndWorkday}
      />
    </div>
  )
}

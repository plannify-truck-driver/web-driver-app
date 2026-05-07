import { useEffect, useMemo, useState } from "react"
import type { RestPeriod } from "@/shared/models/rest-period"
import {
  ArrowLeftIcon,
  CoffeeIcon,
  InfoIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  TimerIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/Dialog"
import { Button } from "@/shared/components/ui/Button"
import { cn } from "@/lib/utils"
import { AddPeriodDialog } from "../../../shared/components/AddPeriodDialog"
import type { addRestPeriodFormSchema } from "@/shared/zod/add-rest-period"
import type z from "zod"
import type { useForm } from "react-hook-form"
import { displayDuration } from "@/shared/functions/displayDuration"
import { calculSeconds } from "@/shared/functions/calculSeconds"

interface PageRestPreferencesProps {
  restPeriods: RestPeriod[]
  form: ReturnType<typeof useForm<z.infer<typeof addRestPeriodFormSchema>>>
  loadings: {
    isLoadingGetRestPeriods: boolean
    isLoadingCreateRestPeriod: boolean
    isLoadingDeleteRestPeriod: boolean
  }
  isAddDialogOpen: boolean
  setIsAddDialogOpen: (open: boolean) => void
  onCreateRestPeriod: (restPeriods: RestPeriod[]) => void
  onDeleteRestPeriod: () => void
}

const TOTAL_MINUTES = 24 * 60

const PERIOD_COLORS = [
  {
    segment: "bg-blue-400/20 dark:bg-blue-500/15",
    card: "border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/20",
    dot: "bg-blue-500",
    label: "text-blue-600 dark:text-blue-400",
  },
  {
    segment: "bg-emerald-400/20 dark:bg-emerald-500/15",
    card: "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20",
    dot: "bg-emerald-500",
    label: "text-emerald-600 dark:text-emerald-400",
  },
  {
    segment: "bg-violet-400/20 dark:bg-violet-500/15",
    card: "border-violet-200 dark:border-violet-800/60 bg-violet-50/50 dark:bg-violet-950/20",
    dot: "bg-violet-500",
    label: "text-violet-600 dark:text-violet-400",
  },
  {
    segment: "bg-amber-400/20 dark:bg-amber-500/15",
    card: "border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20",
    dot: "bg-amber-500",
    label: "text-amber-600 dark:text-amber-400",
  },
  {
    segment: "bg-rose-400/20 dark:bg-rose-500/15",
    card: "border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20",
    dot: "bg-rose-500",
    label: "text-rose-600 dark:text-rose-400",
  },
  {
    segment: "bg-cyan-400/20 dark:bg-cyan-500/15",
    card: "border-cyan-200 dark:border-cyan-800/60 bg-cyan-50/50 dark:bg-cyan-950/20",
    dot: "bg-cyan-500",
    label: "text-cyan-600 dark:text-cyan-400",
  },
] as const

function timeToMinutes(time: string): number {
  const [h, m, s] = time.split(":").map(Number)
  if (h === 23 && m === 59 && s === 59) return 24 * 60
  return (h || 0) * 60 + (m || 0)
}

function addOneSecond(time: string): string {
  const total = calculSeconds(time) + 1
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const hh = String(h).padStart(2, "0")
  const mm = String(m).padStart(2, "0")
  return s === 0 ? `${hh}:${mm}` : `${hh}:${mm}:${String(s).padStart(2, "0")}`
}

function RestPeriodsTimeline({ periods }: { periods: RestPeriod[] }) {
  const { t } = useTranslation()

  if (periods.length === 0) return null

  const lastEndMins = timeToMinutes(periods[periods.length - 1].end)
  const unconfiguredPct = ((TOTAL_MINUTES - lastEndMins) / TOTAL_MINUTES) * 100
  const hasUnconfiguredTail =
    calculSeconds(periods[periods.length - 1].end) < calculSeconds("23:59:59")

  return (
    <div className="select-none">
      <div className="flex h-10 w-full overflow-hidden rounded-lg border">
        {periods.map((period, index) => {
          const durationMins = timeToMinutes(period.end) - timeToMinutes(period.start)
          const widthPct = (durationMins / TOTAL_MINUTES) * 100
          const color = PERIOD_COLORS[index % PERIOD_COLORS.length]
          const restMins = timeToMinutes(period.rest)

          return (
            <div
              key={index}
              className={cn(
                "relative flex items-center justify-center overflow-hidden",
                period.end !== "23:59:59" && "border-r border-white/30 dark:border-black/20",
                color.segment
              )}
              style={{ width: `${widthPct}%` }}
              title={`${displayDuration(period.start, t)} → ${displayDuration(period.end, t)} · ${displayDuration(period.rest, t)}`}
            >
              {widthPct > 7 && (
                <span className={cn("truncate px-1.5 text-xs font-medium", color.label)}>
                  {restMins === 0 ? "–" : displayDuration(period.rest, t)}
                </span>
              )}
            </div>
          )
        })}
        {hasUnconfiguredTail && (
          <div
            className="flex items-center justify-center bg-amber-400/10 dark:bg-amber-500/10"
            style={{ width: `${unconfiguredPct}%` }}
          >
            {unconfiguredPct > 8 && (
              <span className="truncate px-1.5 text-[10px] text-amber-500/70">?</span>
            )}
          </div>
        )}
      </div>

      <div className="relative mt-1.5 h-4">
        {periods.map((period, index) => {
          const leftPct = (timeToMinutes(period.start) / TOTAL_MINUTES) * 100
          return (
            <span
              key={index}
              className={cn(
                "text-muted-foreground absolute text-[10px] whitespace-nowrap",
                index === 0 ? "" : "-translate-x-1/2"
              )}
              style={{ left: `${leftPct}%` }}
            >
              {displayDuration(period.start, t)}
            </span>
          )
        })}
        <span
          className={cn(
            "absolute right-0 text-[10px]",
            hasUnconfiguredTail ? "text-amber-500/70" : "text-muted-foreground"
          )}
        >
          {hasUnconfiguredTail
            ? "24h ?"
            : periods[periods.length - 1].end === "23:59:59"
              ? "24h"
              : displayDuration(periods[periods.length - 1].end, t)}
        </span>
      </div>
    </div>
  )
}

function RestPeriodRow({
  period,
  index,
  canDelete,
  onDelete,
}: {
  period: RestPeriod
  index: number
  canDelete: boolean
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const color = PERIOD_COLORS[index % PERIOD_COLORS.length]
  const restMins = timeToMinutes(period.rest)

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        color.card
      )}
    >
      <div className={cn("h-2 w-2 shrink-0 rounded-full", color.dot)} />

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-0.5 sm:flex-nowrap">
        <div className="flex shrink-0 items-center gap-1.5">
          <TimerIcon className="text-muted-foreground size-3.5" />
          <span className="text-sm font-medium tabular-nums">
            {displayDuration(period.start, t)}
            <span className="text-muted-foreground mx-1 font-normal">→</span>
            {displayDuration(period.end, t)}
          </span>
        </div>

        <span className="text-muted-foreground/40 hidden sm:inline">·</span>

        <div className="flex shrink-0 items-center gap-1.5">
          <CoffeeIcon className="text-muted-foreground size-3.5" />
          <span
            className={cn("text-sm tabular-nums", restMins === 0 && "text-muted-foreground italic")}
          >
            {restMins === 0
              ? t("pages.settings.rest-preferences.no-break")
              : t("pages.settings.rest-preferences.break-of", {
                  duration: displayDuration(period.rest, t),
                })}
          </span>
        </div>
      </div>

      {canDelete ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
        >
          <Trash2Icon />
        </Button>
      ) : (
        <div className="size-8 shrink-0" />
      )}
    </div>
  )
}

function ResetDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{t("pages.settings.rest-preferences.reset-dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.settings.rest-preferences.reset-dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("pages.settings.rest-preferences.reset-dialog.cancel")}
          </Button>
          <Button variant="destructive" isLoading={isLoading} onClick={onConfirm}>
            {t("pages.settings.rest-preferences.reset-dialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function PageRestPreferences({
  restPeriods,
  form,
  loadings,
  isAddDialogOpen,
  setIsAddDialogOpen,
  onCreateRestPeriod,
  onDeleteRestPeriod,
}: PageRestPreferencesProps) {
  const { t } = useTranslation()

  const [localPeriods, setLocalPeriods] = useState<RestPeriod[]>(restPeriods)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  useEffect(() => {
    setLocalPeriods(restPeriods)
  }, [restPeriods])

  const hasChanges = useMemo(() => {
    if (localPeriods.length !== restPeriods.length) return true
    return localPeriods.some(
      (p, i) =>
        p.start !== restPeriods[i]?.start ||
        p.end !== restPeriods[i]?.end ||
        p.rest !== restPeriods[i]?.rest
    )
  }, [localPeriods, restPeriods])

  const nextStart =
    localPeriods.length > 0 ? addOneSecond(localPeriods[localPeriods.length - 1].end) : "00:00"
  const canAddMore = calculSeconds(nextStart) < calculSeconds("23:59:59")

  const isConfigurationComplete =
    localPeriods.length > 0 &&
    calculSeconds(localPeriods[0].start) === 0 &&
    calculSeconds(localPeriods[localPeriods.length - 1].end) >= calculSeconds("23:59:59")

  const handleAddPeriod = (form: z.infer<typeof addRestPeriodFormSchema>) => {
    const newPeriod: RestPeriod = {
      start: nextStart,
      end: form.isEndOfDay ? "23:59:59" : form.end!,
      rest:
        form.restMins === 0
          ? "00:00"
          : `${String(Math.floor(form.restMins / 60)).padStart(2, "0")}:${String(form.restMins % 60).padStart(2, "0")}`,
    }
    setLocalPeriods((prev) => [...prev, newPeriod])
    setIsAddDialogOpen(false)
  }

  const handleDeleteLast = () => {
    setLocalPeriods((prev) => prev.slice(0, -1))
  }

  const handleSave = () => {
    onCreateRestPeriod(localPeriods)
  }

  const handleReset = () => {
    setIsResetDialogOpen(false)
    onDeleteRestPeriod()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
          >
            <ArrowLeftIcon className="size-5" />
            <span className="sr-only">{t("common.back")}</span>
          </button>
          <h1 className="text-2xl font-semibold">
            {t("pages.settings.rest-preferences.page-title")}
          </h1>
        </div>

        {/* How it works */}
        <div className="bg-muted/40 flex gap-3 rounded-lg border p-4">
          <InfoIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">
              {t("pages.settings.rest-preferences.how-it-works-title")}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("pages.settings.rest-preferences.how-it-works-description")}
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="flex flex-col gap-3">
          <h2 className="text-muted-foreground font-mono text-sm uppercase">
            {t("pages.settings.rest-preferences.configuration-title")}
          </h2>

          {loadings.isLoadingGetRestPeriods ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-muted/60 h-12 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : localPeriods.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
              <div className="bg-muted flex h-11 w-11 items-center justify-center rounded-full">
                <CoffeeIcon className="text-muted-foreground size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  {t("pages.settings.rest-preferences.empty-state.title")}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("pages.settings.rest-preferences.empty-state.description")}
                </p>
              </div>
              <Button size="sm" className="mt-1" onClick={() => setIsAddDialogOpen(true)}>
                <PlusIcon />
                {t("pages.settings.rest-preferences.add-first-interval")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <RestPeriodsTimeline periods={localPeriods} />

              <div className="flex items-center gap-6 px-3">
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <TimerIcon className="size-3" />
                  {t("pages.settings.rest-preferences.column-worked")}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <CoffeeIcon className="size-3" />
                  {t("pages.settings.rest-preferences.column-rest")}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {localPeriods.map((period, index) => (
                  <RestPeriodRow
                    key={`${period.start}-${period.end}`}
                    period={period}
                    index={index}
                    canDelete={
                      index === localPeriods.length - 1 && localPeriods.length > restPeriods.length
                    }
                    onDelete={handleDeleteLast}
                  />
                ))}
              </div>

              {canAddMore && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <PlusIcon />
                  {t("pages.settings.rest-preferences.add-interval")}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Incomplete configuration warning */}
        {localPeriods.length > 0 && !isConfigurationComplete && (
          <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-800/60 dark:bg-amber-950/20">
            <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {t("pages.settings.rest-preferences.warning.incomplete")}
            </p>
          </div>
        )}

        {/* Action bar */}
        {(hasChanges || restPeriods.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {restPeriods.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetDialogOpen(true)}
                className="text-muted-foreground hover:text-destructive"
              >
                <RotateCcwIcon />
                {t("pages.settings.rest-preferences.reset-all")}
              </Button>
            )}
            {hasChanges && (
              <Button
                size="sm"
                className="ml-auto"
                onClick={handleSave}
                isLoading={loadings.isLoadingCreateRestPeriod}
                disabled={!isConfigurationComplete}
              >
                <SaveIcon />
                {t("pages.settings.rest-preferences.save")}
              </Button>
            )}
          </div>
        )}
      </div>

      <AddPeriodDialog
        isOpen={isAddDialogOpen}
        form={form}
        onClose={() => setIsAddDialogOpen(false)}
        nextStart={nextStart}
        onSubmit={handleAddPeriod}
      />

      <ResetDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleReset}
        isLoading={loadings.isLoadingDeleteRestPeriod}
      />
    </>
  )
}

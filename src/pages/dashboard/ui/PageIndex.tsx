import type { Workday } from "@/shared/models/workday"
import { ArrowRight, Play } from "lucide-react"
import { toast } from "sonner"
import type { PeriodOfTime } from "../feature/PageIndexFeature"
import { PeriodSelector } from "@/shared/components/PeriodSelector"
import { useTranslation } from "react-i18next"

interface PageDashboardIndexProps {
  workdays: Workday[]
  today: Date
  period: PeriodOfTime
  isLoading: boolean
  error: Error | null
  totalWorkingTime: string
  onPreviousPeriod: () => void
  onNextPeriod: () => void
}

export default function PageDashboardIndex({
  workdays,
  today,
  period,
  isLoading,
  error,
  totalWorkingTime,
  onPreviousPeriod,
  onNextPeriod,
}: PageDashboardIndexProps) {
  const { i18n } = useTranslation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Accueil</h1>
          <p className="text-muted-foreground text-sm">
            Semaine du{" "}
            {period.from.toLocaleDateString(i18n.language, {
              day: "numeric",
              month: "long",
            })}{" "}
            au{" "}
            {period.to.toLocaleDateString(i18n.language, {
              day: "numeric",
              month: "long",
              year: "numeric",
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
      <button
        className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer flex-row items-center justify-between rounded-md px-5 py-4 text-sm text-white"
        onClick={() => toast.info("button pressed")}
      >
        <div className="flex flex-row gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
            <Play size={20} />
          </div>
          <div className="flex flex-col items-start justify-between">
            <span>Commencer ma journée</span>
            <span className="font-light text-white/60">
              Aucune journée en cours -{" "}
              {today.toLocaleDateString(i18n.language, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
        <ArrowRight size={20} />
      </button>
      <div className="grid grid-cols-3 gap-4">
        <div className="border-border bg-sidebar flex flex-col items-start justify-start gap-2 rounded-lg border p-5">
          <p className="text-muted-foreground font-mono text-sm uppercase">Jours travaillés</p>
          <p className="text-muted-foreground text-sm">Cette semaine</p>
          <div className="flex flex-row items-center gap-2 font-mono text-2xl font-semibold">
            <p>{workdays.length}</p>
            <span className="text-muted-foreground">/</span>
            <p className="text-muted-foreground">7</p>
          </div>
        </div>
        <div className="border-border bg-sidebar flex flex-col items-start justify-start gap-2 rounded-lg border p-5">
          <p className="text-muted-foreground font-mono text-sm uppercase">conduite mois</p>
          <p className="font-mono text-2xl font-semibold">{totalWorkingTime}</p>
          <p className="text-muted-foreground text-sm">
            {today.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}

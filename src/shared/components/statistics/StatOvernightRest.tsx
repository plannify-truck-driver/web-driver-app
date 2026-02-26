import type { Workday } from "@/shared/models/workday"
import { Skeleton } from "../ui/Skeleton"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export interface StatOvernightRestProps {
  workdays: Workday[]
  isLoading: boolean
  className?: string
}

export function StatOvernightRest({ workdays, isLoading, className }: StatOvernightRestProps) {
  const { t } = useTranslation()

  const overnightRestDays = workdays.filter((workday) => workday.overnight_rest).length
  const totalDays = workdays.length

  return (
    <div
      className={cn(
        "border-border bg-sidebar flex flex-col items-start justify-start gap-1 rounded-lg border p-3 sm:gap-2 sm:p-5",
        className
      )}
    >
      <p className="text-muted-foreground font-mono text-sm uppercase">
        {t("components.stat-overnight-rest.overnight-rest")}
      </p>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="flex flex-row items-center gap-2 font-mono text-2xl font-semibold">
          <p className="text-success">{overnightRestDays}</p>
          <span className="text-success/80">/</span>
          <p className="text-success/80">{totalDays}</p>
        </div>
      )}
      <p className="text-muted-foreground text-sm">
        {t("components.stat-overnight-rest.overnight-rest-description")}
      </p>
    </div>
  )
}

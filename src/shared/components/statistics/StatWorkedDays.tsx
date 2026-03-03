import { useTranslation } from "react-i18next"
import { Skeleton } from "../ui/Skeleton"

export interface StatWorkedDaysProps {
  statType: "week" | "month"
  workedDays: number
  maxWorkedDays: number
  isLoading: boolean
}

export function StatWorkedDays({
  statType,
  workedDays,
  maxWorkedDays,
  isLoading,
}: StatWorkedDaysProps) {
  const { t } = useTranslation()

  return (
    <div className="border-border bg-sidebar flex flex-col items-start justify-start gap-1 rounded-lg border p-3 sm:gap-2 sm:p-5">
      <p className="text-muted-foreground font-mono text-sm uppercase">
        {t("components.stat-workday.worked-days")}
      </p>
      <p className="text-muted-foreground text-sm">
        {statType === "week"
          ? t("components.stat-workday.this-week")
          : t("components.stat-workday.this-month")}
      </p>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="flex flex-row items-center gap-2 font-mono text-2xl font-semibold">
          <p>{workedDays}</p>
          <span className="text-muted-foreground">/</span>
          <p className="text-muted-foreground">{maxWorkedDays}</p>
        </div>
      )}
    </div>
  )
}

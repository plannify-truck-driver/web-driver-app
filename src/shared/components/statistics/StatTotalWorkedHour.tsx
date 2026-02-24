import { useTranslation } from "react-i18next"
import { Skeleton } from "../ui/Skeleton"

export interface StatTotalWorkedHoursProps {
  totalString: string
  month: Date
  isLoading: boolean
}

export function StatTotalWorkedHours({ totalString, month, isLoading }: StatTotalWorkedHoursProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="border-border bg-sidebar flex flex-col items-start justify-start gap-1 rounded-lg border p-3 sm:gap-2 sm:p-5">
      <p className="text-muted-foreground font-mono text-sm uppercase">
        {t("components.stat-total-worked-hour.this-month")}
      </p>
      {isLoading ? (
        <Skeleton className="h-8 w-40" />
      ) : (
        <p className="font-mono text-2xl font-semibold">{totalString}</p>
      )}
      <p className="text-muted-foreground text-sm">
        {month.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })}
      </p>
    </div>
  )
}

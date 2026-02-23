import { useTranslation } from "react-i18next"
import { Skeleton } from "../ui/Skeleton"

export interface StatWorkedDaysProps {
  workedDays: number
  isLoading: boolean
}

export function StatWorkedDays({ workedDays, isLoading }: StatWorkedDaysProps) {
  const { t } = useTranslation()

  return (
    <div className="border-border bg-sidebar flex flex-col items-start justify-start gap-2 rounded-lg border p-5">
      <p className="text-muted-foreground font-mono text-sm uppercase">
        {t("components.stat-workday.worked-days")}
      </p>
      <p className="text-muted-foreground text-sm">{t("components.stat-workday.this-week")}</p>
      {isLoading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="flex flex-row items-center gap-2 font-mono text-2xl font-semibold">
          <p>{workedDays}</p>
          <span className="text-muted-foreground">/</span>
          <p className="text-muted-foreground">7</p>
        </div>
      )}
    </div>
  )
}

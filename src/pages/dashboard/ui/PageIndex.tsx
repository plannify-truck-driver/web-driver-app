import type { Workday } from "@/shared/models/workday"

interface PageDashboardIndexProps {
  workdays: Workday[]
  isLoading: boolean
  error: Error | null
}

export default function PageDashboardIndex({
  workdays,
  isLoading,
  error,
}: PageDashboardIndexProps) {
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Accueil</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="border-muted bg-sidebar flex flex-col items-start justify-start gap-1 rounded-lg border p-5">
          <p className="text-muted-foreground text-sm uppercase">Jours travaillés</p>
          <p className="text-muted-foreground text-sm">Cette semaine</p>
          <div className="flex flex-row items-center gap-2 text-2xl font-semibold">
            <p>{workdays.length}</p>
            <span className="text-muted-foreground">/</span>
            <p className="text-muted-foreground">7</p>
          </div>
        </div>
        <div className="border-muted bg-sidebar flex flex-col items-start justify-start gap-1 rounded-lg border p-5">
          <p className="text-muted-foreground text-sm uppercase">conduite mois</p>
          <p className="text-2xl font-semibold">0h</p>
          <p className="text-muted-foreground">février 2026</p>
        </div>
      </div>
    </div>
  )
}

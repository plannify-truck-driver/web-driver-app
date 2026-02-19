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

  return <div>Il y a {workdays.length} jours de travail dans le calendrier.</div>
}

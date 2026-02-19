import { useGetWorkdaysByPeriod } from "@/shared/queries/workday/workday.queries"
import PageDashboardIndex from "../ui/PageIndex"

export default function PageDashboardIndexFeature() {
  const tody: Date = new Date()
  const monday: Date = new Date(tody.setDate(tody.getDate() - tody.getDay() + 1))
  const sunday: Date = new Date(tody.setDate(tody.getDate() - tody.getDay() + 7))

  const { data, isLoading, error } = useGetWorkdaysByPeriod({
    from: monday.toISOString().split("T")[0],
    to: sunday.toISOString().split("T")[0],
    page: 1,
    limit: 100,
  })

  return <PageDashboardIndex workdays={data?.data ?? []} isLoading={isLoading} error={error} />
}

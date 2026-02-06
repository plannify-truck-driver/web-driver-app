import PageDashboardIndexFeature from "@/pages/dashboard/feature/PageIndexFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
  component: PageDashboardIndexFeature,
})

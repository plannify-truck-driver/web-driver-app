import PageWorkdayDetailFeature from "@/pages/workdays/feature/PageWorkdayDetailFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/workdays/$workdayDate")({
  component: PageWorkdayDetailFeature,
})

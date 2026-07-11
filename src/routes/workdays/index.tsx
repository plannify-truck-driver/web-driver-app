import PageWorkdaysFeature from "@/pages/workdays/feature/PageWorkdaysFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/workdays/")({
  component: PageWorkdaysFeature,
})

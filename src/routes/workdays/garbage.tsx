import PageWorkdayGarbageFeature from "@/pages/workdays/feature/PageWorkdayGarbageFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/workdays/garbage")({
  component: PageWorkdayGarbageFeature,
})

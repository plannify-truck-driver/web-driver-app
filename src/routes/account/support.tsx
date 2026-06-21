import PageSupportFeature from "@/pages/account/feature/PageSupportFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/support")({
  component: PageSupportFeature,
})

import PageSuspendedFeature from "@/pages/authentication/feature/PageSuspendedFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/suspended")({
  component: PageSuspendedFeature,
})

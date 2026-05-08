import PageApplicationPreferencesFeature from "@/pages/settings/feature/PageApplicationPreferencesFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings/application-preferences")({
  component: PageApplicationPreferencesFeature,
})

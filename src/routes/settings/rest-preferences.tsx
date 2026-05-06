import PageRestPreferencesFeature from "@/pages/settings/feature/PageRestPreferencesFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings/rest-preferences")({
  component: PageRestPreferencesFeature,
})

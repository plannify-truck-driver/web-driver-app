import PageMailPreferencesFeature from "@/pages/account/feature/PageMailPreferencesFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/mails/preferences")({
  component: PageMailPreferencesFeature,
})

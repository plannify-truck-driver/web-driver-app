import PageMailsFeature from "@/pages/account/feature/PageMailsFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/mails/")({
  component: PageMailsFeature,
})

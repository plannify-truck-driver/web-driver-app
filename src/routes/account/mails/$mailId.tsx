import PageMailDetailFeature from "@/pages/account/feature/PageMailDetailFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/mails/$mailId")({
  component: PageMailDetailFeature,
})

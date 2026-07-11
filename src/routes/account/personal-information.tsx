import PagePersonalInformationFeature from "@/pages/account/feature/PagePersonalInformationFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/personal-information")({
  component: PagePersonalInformationFeature,
})

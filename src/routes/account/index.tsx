import PageAccountFeature from "@/pages/account/feature/PageAccountFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/")({
  component: PageAccountFeature,
})

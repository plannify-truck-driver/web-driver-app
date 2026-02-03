import PageLoginFeature from "@/pages/authentication/feature/PageLoginFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/login")({
  component: PageLoginFeature,
})

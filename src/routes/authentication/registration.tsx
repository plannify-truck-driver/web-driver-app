import PageRegistrationFeature from "@/pages/authentication/feature/PageRegistrationFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/registration")({
  component: PageRegistrationFeature,
})

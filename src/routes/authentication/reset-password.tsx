import PageResetPasswordFeature from "@/pages/authentication/feature/PageResetPasswordFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/reset-password")({
  component: PageResetPasswordFeature,
})

import PageResetPasswordFeature from "@/pages/authentication/token/feature/PageResetPasswordFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/token/reset-password")({
  component: PageResetPasswordFeature,
})

import PageVerifyAccountFeature from "@/pages/authentication/token/feature/PageVerifyAccountFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/token/verify-account")({
  component: PageVerifyAccountFeature,
})

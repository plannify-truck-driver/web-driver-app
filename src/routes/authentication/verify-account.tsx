import PageVerifyAccountFeature from "@/pages/authentication/feature/PageVerifyAccountFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/authentication/verify-account")({
  component: PageVerifyAccountFeature,
})

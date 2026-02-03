import PageIndexFeature from "@/pages/index/feature/PageIndexFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: PageIndexFeature,
})

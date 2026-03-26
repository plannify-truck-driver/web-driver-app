import PageDocumentsFeature from "@/pages/documents/feature/PageDocumentsFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/documents/")({
  component: PageDocumentsFeature,
})

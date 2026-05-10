import PageDocumentsFeature from "@/pages/documents/feature/PageDocumentsFeature"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/documents/")({
  component: PageDocumentsFeature,
  validateSearch: (search: Record<string, unknown>) => ({
    year: typeof search.year === "number" ? search.year : undefined,
    month: typeof search.month === "number" ? search.month : undefined,
  }),
})

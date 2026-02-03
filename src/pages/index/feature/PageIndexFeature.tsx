import { useDocumentTitle } from "@/hooks/use-document-title"
import PageIndex from "../ui/PageIndex"

export default function PageIndexFeature() {
  useDocumentTitle("Page d'accueil")

  return <PageIndex />
}

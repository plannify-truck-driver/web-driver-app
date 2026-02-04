import { useDocumentTitle } from "@/hooks/use-document-title"
import PageRegistration from "../ui/PageRegistration"

export default function PageRegistrationFeature() {
  useDocumentTitle("Inscription")

  return <PageRegistration />
}

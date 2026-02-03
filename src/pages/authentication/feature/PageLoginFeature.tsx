import { useDocumentTitle } from "@/hooks/use-document-title"
import PageLogin from "../ui/PageLogin"
import { useTranslation } from "react-i18next"

export default function PageLoginFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("authentication.login.page-title"))

  return <PageLogin />
}

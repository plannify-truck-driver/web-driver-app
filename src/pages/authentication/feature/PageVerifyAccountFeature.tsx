import { useDocumentTitle } from "@/hooks/use-document-title"
import PageVerifyAccount from "../ui/PageVerifyAccount"
import { useTranslation } from "react-i18next"

export default function PageVerifyAccountFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.authentication.verify-account.page-title"))

  return <PageVerifyAccount />
}

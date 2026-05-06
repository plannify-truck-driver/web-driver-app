import { useAuth } from "@/app/providers/AuthProvider"
import PageAccount from "../ui/PageAccount"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"

export default function PageAccountFeature() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { t } = useTranslation()

  useDocumentTitle(t("pages.account.page-title"))

  return (
    <PageAccount
      driver={driver}
      onLogout={logout}
      isDeletingRefreshToken={isDeletingRefreshToken}
    />
  )
}

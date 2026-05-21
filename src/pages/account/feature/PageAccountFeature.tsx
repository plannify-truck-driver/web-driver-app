import { useAuth } from "@/app/providers/AuthProvider"
import { useShareBannerDismiss } from "@/hooks/use-share-banner-dismiss"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import PageAccount from "../ui/PageAccount"

export default function PageAccountFeature() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { t } = useTranslation()
  const { isVisible: isShareBannerVisible, dismiss: dismissShareBanner } = useShareBannerDismiss()

  useDocumentTitle(t("pages.account.page-title"))

  return (
    <PageAccount
      driver={driver}
      onLogout={logout}
      isDeletingRefreshToken={isDeletingRefreshToken}
      isShareBannerVisible={isShareBannerVisible}
      onDismissShareBanner={dismissShareBanner}
    />
  )
}

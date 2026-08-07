import { useAuth } from "@/app/providers/useAuth"
import { useShareBannerDismiss } from "@/hooks/use-share-banner-dismiss"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import PageAccount from "../ui/PageAccount"
import { useUpdates } from "@/shared/queries/updates/updates.queries"
import { useInformations } from "@/shared/queries/informations/informations.queries"

export default function PageAccountFeature() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { t } = useTranslation()
  const { isVisible: isShareBannerVisible, dismiss: dismissShareBanner } = useShareBannerDismiss()
  const { data: updatesData } = useUpdates({
    version: import.meta.env.VITE_VERSION,
    limit: 10,
    page: 1,
  })
  const { data: informationsData } = useInformations()

  useDocumentTitle(t("pages.account.page-title"))

  return (
    <PageAccount
      driver={driver}
      onLogout={logout}
      isDeletingRefreshToken={isDeletingRefreshToken}
      isShareBannerVisible={isShareBannerVisible}
      onDismissShareBanner={dismissShareBanner}
      updates={updatesData?.data ?? []}
      informations={informationsData ?? []}
    />
  )
}

import { useShowSeconds } from "@/hooks/use-show-seconds"
import { useMaxWorkdayDuration } from "@/hooks/use-max-workday-duration"
import { useRestPeriodBannerDismiss } from "@/hooks/use-rest-period-banner-dismiss"
import { useDocumentsBannerDismiss } from "@/hooks/use-documents-banner-dismiss"
import PageApplicationPreferences from "../ui/PageApplicationPreferences"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"

export default function PageApplicationPreferencesFeature() {
  const { t } = useTranslation()
  useDocumentTitle(t("pages.settings.application-preferences.page-title"))

  const { showSeconds, setShowSeconds } = useShowSeconds()
  const { maxHours, setMaxHours } = useMaxWorkdayDuration()
  const restPeriodBanner = useRestPeriodBannerDismiss()
  const documentsBanner = useDocumentsBannerDismiss()

  return (
    <PageApplicationPreferences
      showSeconds={showSeconds}
      onShowSecondsChange={setShowSeconds}
      maxHours={maxHours}
      onMaxHoursChange={setMaxHours}
      banners={[
        {
          key: "rest-period",
          count: restPeriodBanner.count,
          maxDismissals: restPeriodBanner.maxDismissals,
          nextDisplayAt: restPeriodBanner.nextDisplayAt,
          isVisible: restPeriodBanner.isVisible,
          onReset: restPeriodBanner.reset,
        },
        {
          key: "documents",
          count: documentsBanner.count,
          maxDismissals: documentsBanner.maxDismissals,
          nextDisplayAt: documentsBanner.nextDisplayAt,
          isVisible: documentsBanner.isVisible,
          onReset: documentsBanner.reset,
        },
      ]}
    />
  )
}

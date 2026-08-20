import { useShowSeconds } from "@/hooks/use-show-seconds"
import { useMaxWorkdayDuration } from "@/hooks/use-max-workday-duration"
import { useRestPeriodBannerDismiss } from "@/hooks/use-rest-period-banner-dismiss"
import { useDocumentsBannerDismiss } from "@/hooks/use-documents-banner-dismiss"
import { useShareBannerDismiss } from "@/hooks/use-share-banner-dismiss"
import { useEndWorkdayRestDialogDismissed } from "@/hooks/use-end-workday-rest-dialog-dismissed"
import { useDriverPreferences } from "@/app/providers/useDriverPreferences"
import PageApplicationPreferences from "../ui/PageApplicationPreferences"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"

export default function PageApplicationPreferencesFeature() {
  const { t } = useTranslation()
  useDocumentTitle(t("pages.settings.application-preferences.page-title"))

  const { showSeconds, setShowSeconds } = useShowSeconds()
  const { maxHours, setMaxHours } = useMaxWorkdayDuration()
  const { preferences, setPreferences } = useDriverPreferences()
  const restPeriodBanner = useRestPeriodBannerDismiss()
  const documentsBanner = useDocumentsBannerDismiss()
  const shareBanner = useShareBannerDismiss()
  const {
    isDismissed: isEndWorkdayRestDialogDismissed,
    setIsDismissed: setIsEndWorkdayRestDialogDismissed,
  } = useEndWorkdayRestDialogDismissed()

  return (
    <PageApplicationPreferences
      showSeconds={showSeconds}
      onShowSecondsChange={setShowSeconds}
      maxHours={maxHours}
      onMaxHoursChange={setMaxHours}
      workdayRowType={preferences.workdayTableRowType}
      onWorkdayRowTypeChange={(type) =>
        setPreferences({ ...preferences, workdayTableRowType: type })
      }
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
        {
          key: "share",
          count: shareBanner.count,
          maxDismissals: shareBanner.maxDismissals,
          nextDisplayAt: shareBanner.nextDisplayAt,
          isVisible: shareBanner.isVisible,
          onReset: shareBanner.reset,
        },
        {
          key: "end-workday-rest-dialog",
          count: isEndWorkdayRestDialogDismissed ? 1 : 0,
          maxDismissals: 1,
          nextDisplayAt: null,
          isVisible: !isEndWorkdayRestDialogDismissed,
          onReset: () => setIsEndWorkdayRestDialogDismissed(false),
        },
      ]}
    />
  )
}

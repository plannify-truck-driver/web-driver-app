import { ArrowLeftIcon, BellIcon, ClockIcon, RotateCcwIcon, TimerIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Switch } from "@/shared/components/ui/Switch"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"

const DEFAULT_SHOW_SECONDS = false
const DEFAULT_MAX_HOURS = 18

interface BannerInfo {
  key: string
  count: number
  maxDismissals: number
  nextDisplayAt: Date | null
  isVisible: boolean
  onReset: () => void
}

interface PageApplicationPreferencesProps {
  showSeconds: boolean
  onShowSecondsChange: (value: boolean) => void
  maxHours: number
  onMaxHoursChange: (value: number) => void
  banners: BannerInfo[]
}

export default function PageApplicationPreferences({
  showSeconds,
  onShowSecondsChange,
  maxHours,
  onMaxHoursChange,
  banners,
}: PageApplicationPreferencesProps) {
  const { t, i18n } = useTranslation()

  const handleMaxHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 24) {
      onMaxHoursChange(value)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="sr-only">{t("common.back")}</span>
        </button>
        <h1 className="text-2xl font-semibold">
          {t("pages.settings.application-preferences.page-title")}
        </h1>
      </div>

      {/* Display */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-muted-foreground font-mono text-sm uppercase">
          {t("pages.settings.application-preferences.display-section")}
        </h2>

        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="flex items-center gap-3">
            <ClockIcon className="text-muted-foreground size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">
                {t("pages.settings.application-preferences.show-seconds-label")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("pages.settings.application-preferences.show-seconds-description")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {showSeconds !== DEFAULT_SHOW_SECONDS && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onShowSecondsChange(DEFAULT_SHOW_SECONDS)}
                className="text-muted-foreground"
                title={t("pages.settings.application-preferences.reset-default")}
              >
                <RotateCcwIcon />
              </Button>
            )}
            <Switch checked={showSeconds} onCheckedChange={onShowSecondsChange} />
          </div>
        </div>
      </div>

      {/* Workday */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-muted-foreground font-mono text-sm uppercase">
          {t("pages.settings.application-preferences.workday-section")}
        </h2>

        <div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
          <div className="flex items-center gap-3">
            <TimerIcon className="text-muted-foreground size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">
                {t("pages.settings.application-preferences.max-workday-duration-label")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("pages.settings.application-preferences.max-workday-duration-description")}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {maxHours !== DEFAULT_MAX_HOURS && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onMaxHoursChange(DEFAULT_MAX_HOURS)}
                className="text-muted-foreground"
                title={t("pages.settings.application-preferences.reset-default")}
              >
                <RotateCcwIcon />
              </Button>
            )}
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={1}
                max={24}
                value={maxHours}
                onChange={handleMaxHoursChange}
                className="w-16 text-center"
              />
              <span className="text-muted-foreground text-sm">
                {t("pages.settings.application-preferences.max-workday-duration-unit")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-muted-foreground font-mono text-sm uppercase">
          {t("pages.settings.application-preferences.banners-section")}
        </h2>

        <div className="flex flex-col divide-y rounded-lg border">
          {banners.map((banner) => {
            const isPermanentlyDismissed = banner.count >= banner.maxDismissals

            return (
              <div key={banner.key} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="flex items-start gap-3">
                  <BellIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">
                        {t(`pages.settings.application-preferences.banner-${banner.key}-label`)}
                      </p>
                      {isPermanentlyDismissed ? (
                        <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
                          {t("pages.settings.application-preferences.banner-permanently-dismissed")}
                        </span>
                      ) : banner.isVisible ? (
                        <span className="bg-success/10 text-success rounded-md px-2 py-0.5 text-xs font-medium">
                          {t("pages.settings.application-preferences.banner-visible")}
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                          {t("pages.settings.application-preferences.banner-next-display", {
                            date: banner.nextDisplayAt!.toLocaleDateString(i18n.language, {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }),
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {t(`pages.settings.application-preferences.banner-${banner.key}-description`)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 pt-0.5">
                  <span className="text-muted-foreground tabular-nums text-sm">
                    {banner.count}/{banner.maxDismissals}
                  </span>
                  {banner.count > 0 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={banner.onReset}
                      className="text-muted-foreground"
                      title={t("pages.settings.application-preferences.reset-default")}
                    >
                      <RotateCcwIcon />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

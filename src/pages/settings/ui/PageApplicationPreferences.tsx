import { ArrowLeftIcon, ClockIcon, RotateCcwIcon, TimerIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Switch } from "@/shared/components/ui/Switch"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"

const DEFAULT_SHOW_SECONDS = false
const DEFAULT_MAX_HOURS = 18

interface PageApplicationPreferencesProps {
  showSeconds: boolean
  onShowSecondsChange: (value: boolean) => void
  maxHours: number
  onMaxHoursChange: (value: number) => void
}

export default function PageApplicationPreferences({
  showSeconds,
  onShowSecondsChange,
  maxHours,
  onMaxHoursChange,
}: PageApplicationPreferencesProps) {
  const { t } = useTranslation()

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
    </div>
  )
}

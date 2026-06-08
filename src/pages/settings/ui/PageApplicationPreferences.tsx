import {
  ArrowLeftIcon,
  BellIcon,
  ClockIcon,
  LaptopIcon,
  MonitorIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  TabletIcon,
  TimerIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { Switch } from "@/shared/components/ui/Switch"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { WorkdayTableRow1 } from "@/shared/components/workdayTableRows/WorkdayTableRow1"
import { WorkdayTableRow2 } from "@/shared/components/workdayTableRows/WorkdayTableRow2"
import { WorkdayTableRow3 } from "@/shared/components/workdayTableRows/WorkdayTableRow3"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { Workday } from "@/shared/models/workday"

const DEFAULT_SHOW_SECONDS = false
const DEFAULT_MAX_HOURS = 18
const DEFAULT_WORKDAY_ROW_TYPE = 1 as const

const MOCK_WORKDAY: Workday = {
  date: "2025-05-21",
  start_time: "08:30",
  end_time: "17:00",
  rest_time: "1:00",
  overnight_rest: false,
}

const ROW_COMPONENTS = {
  1: WorkdayTableRow1,
  2: WorkdayTableRow2,
  3: WorkdayTableRow3,
} as const

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
  workdayRowType: 1 | 2 | 3
  onWorkdayRowTypeChange: (type: 1 | 2 | 3) => void
  banners: BannerInfo[]
}

export default function PageApplicationPreferences({
  showSeconds,
  onShowSecondsChange,
  maxHours,
  onMaxHoursChange,
  workdayRowType,
  onWorkdayRowTypeChange,
  banners,
}: PageApplicationPreferencesProps) {
  const { t, i18n } = useTranslation()

  const [rawMaxHours, setRawMaxHours] = useState(String(maxHours))

  useEffect(() => {
    setRawMaxHours(String(maxHours))
  }, [maxHours])

  const handleMaxHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawMaxHours(e.target.value)
  }

  const handleMaxHoursBlur = () => {
    const value = parseInt(rawMaxHours, 10)
    if (!isNaN(value) && value >= 1 && value <= 24) {
      onMaxHoursChange(value)
    } else {
      setRawMaxHours(String(maxHours))
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

      <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/20 dark:text-blue-400">
        <SmartphoneIcon className="size-4 shrink-0 md:hidden" />
        <TabletIcon className="hidden size-4 shrink-0 md:block lg:hidden" />
        <LaptopIcon className="hidden size-4 shrink-0 lg:block xl:hidden" />
        <MonitorIcon className="hidden size-4 shrink-0 xl:block" />
        <p className="md:hidden">
          {t("pages.settings.application-preferences.device-notice-phone")}
        </p>
        <p className="hidden md:block lg:hidden">
          {t("pages.settings.application-preferences.device-notice-tablet")}
        </p>
        <p className="hidden lg:block">
          {t("pages.settings.application-preferences.device-notice-computer")}
        </p>
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

      {/* Workday display format */}
      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-muted-foreground font-mono text-sm uppercase">
            {t("pages.settings.application-preferences.workday-display-format-section")}
          </h2>
          {workdayRowType !== DEFAULT_WORKDAY_ROW_TYPE && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onWorkdayRowTypeChange(DEFAULT_WORKDAY_ROW_TYPE)}
              className="text-muted-foreground"
              title={t("pages.settings.application-preferences.reset-default")}
            >
              <RotateCcwIcon />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {([1, 2, 3] as const).map((type) => {
            const Component = ROW_COMPONENTS[type]
            const isSelected = workdayRowType === type

            return (
              <button
                key={type}
                type="button"
                className={cn(
                  "relative rounded-lg border-2 p-0.5 text-left transition-colors",
                  isSelected ? "border-primary" : "border-border hover:border-primary/40"
                )}
                onClick={() => onWorkdayRowTypeChange(type)}
              >
                {isSelected && (
                  <div className="bg-primary absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full">
                    <Check className="size-3 text-white" />
                  </div>
                )}
                <div className="pointer-events-none">
                  <Component
                    workday={MOCK_WORKDAY}
                    date={new Date(MOCK_WORKDAY.date + "T00:00:00")}
                    isFirst
                    isLast
                    onClick={() => {}}
                  />
                </div>
              </button>
            )
          })}
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={rawMaxHours}
                onChange={handleMaxHoursChange}
                onBlur={handleMaxHoursBlur}
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
                  <span className="text-muted-foreground text-sm tabular-nums">
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

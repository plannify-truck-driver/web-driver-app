import { useTheme } from "@/app/providers/useTheme"
import { NoDriverLoaded } from "@/shared/components/NoDriverLoaded"
import { ShareBanner } from "@/shared/components/ShareBanner"
import SettingsActionGroup from "@/shared/components/SettingsActionGroup"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import type { Driver } from "@/shared/models/driver"
import type { Update } from "@/shared/queries/updates/updates.types"
import { useNavigate } from "@tanstack/react-router"
import {
  BadgeCheckIcon,
  BookMarkedIcon,
  CheckIcon,
  ChevronDownIcon,
  CirclePauseIcon,
  ClockAlertIcon,
  DownloadIcon,
  EarthIcon,
  InfoIcon,
  LaptopIcon,
  LogOutIcon,
  MailsIcon,
  MoonIcon,
  RefreshCwIcon,
  SettingsIcon,
  SparklesIcon,
  SunIcon,
  UserPenIcon,
} from "lucide-react"
import { usePwaUpdate } from "@/app/providers/usePwaUpdate"
import { Button } from "@/shared/components/ui/Button"
import { useTranslation } from "react-i18next"

interface PageAccountProps {
  driver: Driver | null
  onLogout: () => void
  isDeletingRefreshToken: boolean
  isShareBannerVisible: boolean
  onDismissShareBanner: () => void
  updates: Update[]
}

export default function PageAccount({
  driver,
  onLogout,
  isDeletingRefreshToken,
  isShareBannerVisible,
  onDismissShareBanner,
  updates,
}: PageAccountProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { needRefresh, updateServiceWorker } = usePwaUpdate()

  if (!driver) {
    return <NoDriverLoaded />
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <h1 className="text-2xl font-semibold">{t("pages.account.page-title")}</h1>
      <div className="flex flex-row items-center gap-4">
        <span className="bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm text-lg font-medium">
          {(driver.first_name.at(0) ?? "").toUpperCase() +
            (driver.last_name.at(0) ?? "").toUpperCase()}
        </span>
        <div className="flex flex-col">
          <p className="text-lg leading-none font-medium">
            {driver.first_name} {driver.last_name}
          </p>
          <div className="flex flex-row items-center gap-2">
            <p className="text-muted-foreground truncate text-sm">{driver.email}</p>
            {driver.verified && <BadgeCheckIcon className="text-primary inline-block h-4 w-4" />}
          </div>
        </div>
      </div>
      {isShareBannerVisible && (
        <div className="sm:hidden">
          <ShareBanner onDismiss={onDismissShareBanner} />
        </div>
      )}
      {needRefresh && (
        <div className="from-primary/5 to-background border-primary/15 flex items-center justify-between gap-3 rounded-lg border bg-gradient-to-br p-4">
          <div className="flex items-center gap-3">
            <DownloadIcon className="text-primary size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">{t("pages.account.pwa-update.available")}</p>
              <p className="text-muted-foreground text-xs">
                {t("pages.account.pwa-update.description")}
              </p>
            </div>
          </div>
          <Button onClick={() => updateServiceWorker()} size="sm" className="shrink-0">
            {t("pages.account.pwa-update.action")}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <SettingsActionGroup
            title={t("pages.account.settings-actions.account-section-title")}
            items={[
              {
                icon: UserPenIcon,
                label: t("pages.account.settings-actions.personal-information"),
                onClick: () => navigate({ to: "/account/personal-information" }),
              },
              {
                icon: MailsIcon,
                label: t("pages.account.settings-actions.email-management"),
                onClick: () => navigate({ to: "/account/mails" }),
              },
              {
                icon: CirclePauseIcon,
                label: t("pages.account.settings-actions.rest-preferences"),
                onClick: () => navigate({ to: "/settings/rest-preferences" }),
              },
              {
                icon: SettingsIcon,
                label: t("pages.account.settings-actions.application-preferences"),
                onClick: () => navigate({ to: "/settings/application-preferences" }),
              },
              {
                icon: theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : LaptopIcon,
                label: t("pages.account.settings-actions.theme"),
                content: (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
                      <span className="text-muted-foreground">{t(`themes.${theme}`)}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent>
                        {["light", "dark", "system"].map((themeOption) => (
                          <DropdownMenuItem
                            key={themeOption}
                            onClick={() => setTheme(themeOption as "light" | "dark" | "system")}
                            className="text-responsive-base!"
                          >
                            {t(`themes.${themeOption}`)}
                            {theme === themeOption && <CheckIcon className="ml-auto size-4" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenu>
                ),
              },
              {
                icon: EarthIcon,
                label: t("pages.account.settings-actions.language"),
                content: (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
                      <span className="text-muted-foreground">
                        {t(`languages.${i18n.language.split("-")[0].toLowerCase()}`)}
                      </span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent>
                        {Array.isArray(i18n.options.supportedLngs)
                          ? i18n.options.supportedLngs
                              .filter(
                                (lng) =>
                                  import.meta.env.VITE_ENV == "development" || lng !== "cimode"
                              )
                              .map((lng) => (
                                <DropdownMenuItem
                                  onClick={() => i18n.changeLanguage(lng)}
                                  className="text-responsive-base!"
                                  key={lng}
                                >
                                  {t(`languages.${lng}`)}
                                  {i18n.language === lng && (
                                    <CheckIcon className="ml-auto size-4" />
                                  )}
                                </DropdownMenuItem>
                              ))
                          : null}
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenu>
                ),
              },
            ]}
          />
        </div>
        <div>
          <SettingsActionGroup
            title={t("pages.account.settings-actions.support-section-title")}
            items={[
              {
                icon: InfoIcon,
                label: t("pages.account.settings-actions.help-support"),
                onClick: () => navigate({ to: "/account/support" }),
              },
              {
                icon: BookMarkedIcon,
                label: t("pages.account.settings-actions.about-plannify"),
                onClick: () => {},
              },
              {
                icon: LogOutIcon,
                label: t("pages.account.settings-actions.logout"),
                labelColor: "var(--destructive)",
                onClick: onLogout,
                isLoading: isDeletingRefreshToken,
              },
            ]}
          />
        </div>
      </div>

      {updates.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SparklesIcon className="text-primary size-4" />
              <h3 className="text-sm font-semibold">{t("pages.account.updates.section-title")}</h3>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-muted-foreground hover:text-foreground hidden items-center gap-1.5 text-xs transition-colors sm:flex"
            >
              <RefreshCwIcon className="size-3.5" />
              {t("pages.account.updates.refresh")}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {updates.map((update) => (
              <div
                key={update.version}
                className="from-primary/5 to-background border-primary/15 relative flex flex-col gap-3 overflow-hidden rounded-lg border bg-gradient-to-br p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-primary font-mono text-base font-bold">
                    v{update.version}
                  </span>
                  {update.mandatory_completion_date && (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <ClockAlertIcon className="size-3" />
                      {t("pages.account.updates.mandatory-before", {
                        date: new Date(update.mandatory_completion_date).toLocaleDateString(
                          i18n.language,
                          { day: "numeric", month: "long", year: "numeric" }
                        ),
                      })}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {update.description}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="border-primary/20 text-primary hover:bg-primary/5 flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-colors sm:hidden"
          >
            <RefreshCwIcon className="size-4" />
            {t("pages.account.updates.refresh")}
          </button>
        </div>
      )}
    </div>
  )
}

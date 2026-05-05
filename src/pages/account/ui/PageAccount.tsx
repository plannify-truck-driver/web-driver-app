import { useTheme } from "@/app/providers/ThemeProvider"
import { NoDriverLoaded } from "@/shared/components/NoDriverLoaded"
import SettingsActionGroup from "@/shared/components/SettingsActionGroup"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import type { Driver } from "@/shared/models/driver"
import {
  BadgeCheckIcon,
  BookMarkedIcon,
  CheckIcon,
  ChevronDownIcon,
  CirclePauseIcon,
  EarthIcon,
  InfoIcon,
  LaptopIcon,
  LogOutIcon,
  MailsIcon,
  MoonIcon,
  SunIcon,
  UserPenIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

interface PageAccountProps {
  driver: Driver | null
  onLogout: () => void
  isDeletingRefreshToken: boolean
}

export default function PageAccount({
  driver,
  onLogout,
  isDeletingRefreshToken,
}: PageAccountProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <SettingsActionGroup
            title={t("pages.account.settings-actions.account-section-title")}
            items={[
              {
                icon: UserPenIcon,
                label: t("pages.account.settings-actions.personal-information"),
                onClick: () => {},
              },
              {
                icon: MailsIcon,
                label: t("pages.account.settings-actions.email-preferences"),
                onClick: () => {},
              },
              {
                icon: CirclePauseIcon,
                label: t("pages.account.settings-actions.rest-preferences"),
                onClick: () => {},
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
                        {t(`languages.${i18n.language}`)}
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
                onClick: () => {},
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
    </div>
  )
}

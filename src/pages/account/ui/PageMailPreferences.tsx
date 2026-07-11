import { ArrowLeftIcon, CircleQuestionMarkIcon, SettingsIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { Switch } from "@/shared/components/ui/Switch"
import type { MailPreference } from "@/shared/queries/mails/mails.types"
import { MailTypeStatusBadge } from "@/shared/components/MailTypeStatusBadge"

interface PageMailPreferencesProps {
  preferences: MailPreference[]
  isLoading: boolean
  togglingTypeId: number | null
  onTogglePreference: (typeId: number, isEnabled: boolean) => void
  onBack: () => void
}

export default function PageMailPreferences({
  preferences,
  isLoading,
  togglingTypeId,
  onTogglePreference,
  onBack,
}: PageMailPreferencesProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="sr-only">{t("common.back")}</span>
        </button>
        <h1 className="text-2xl font-semibold">{t("pages.account.mail-preferences.page-title")}</h1>
      </div>

      {preferences.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/20 dark:text-blue-400">
          <CircleQuestionMarkIcon className="size-4 shrink-0" />
          <p>{t("pages.account.mail-preferences.support-help")}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <SettingsIcon className="text-muted-foreground size-3.5" />
          <p className="text-muted-foreground font-mono text-sm uppercase">
            {t("pages.account.mail-preferences.section-title")}
          </p>
        </div>
        <div className="flex flex-col divide-y rounded-lg border">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
            ))
          ) : preferences.length === 0 ? (
            <div className="text-muted-foreground px-4 py-3 text-sm">
              {t("pages.account.mail-preferences.empty")}
            </div>
          ) : (
            preferences.map((preference) => {
              return (
                <div key={preference.mail_type_id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {t(`pages.account.mails.types.${preference.label}`, {
                        defaultValue: preference.label,
                      })}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t(`pages.account.mails.preferences.descriptions.${preference.label}`, {
                        defaultValue: "",
                      })}
                    </p>
                  </div>
                  {preference.is_editable ? (
                    <Switch
                      checked={preference.is_enabled}
                      disabled={
                        !preference.is_editable || togglingTypeId === preference.mail_type_id
                      }
                      onCheckedChange={(checked) =>
                        onTogglePreference(preference.mail_type_id, checked)
                      }
                    />
                  ) : (
                    <MailTypeStatusBadge status={preference.is_enabled} />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

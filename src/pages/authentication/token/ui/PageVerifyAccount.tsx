import { Loader } from "@/shared/components/Loader"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { Switch } from "@/shared/components/ui/Switch"
import type { MailType } from "@/shared/queries/mails/mails.types"
import { CheckCircle2Icon, TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PageVerifyAccountProps {
  message: { success: string; error: string } | null
  loading: boolean
  mailTypes: MailType[]
  isLoadingMailTypes: boolean
  localPreferences: Map<number, boolean>
  updatingTypeId: number | null
  onTogglePreference: (typeId: number, isEnabled: boolean) => void
  onContinue: () => void
}

export default function PageVerifyAccount({
  message,
  loading,
  mailTypes,
  isLoadingMailTypes,
  localPreferences,
  updatingTypeId,
  onTogglePreference,
  onContinue,
}: PageVerifyAccountProps) {
  const { t } = useTranslation()

  if (message?.success) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-2.5">
          <CheckCircle2Icon className="text-primary mt-0.5 size-5 shrink-0" />
          <p className="text-sm">{message.success}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold">
              {t("pages.authentication.token-verify-account.mail-preferences-title")}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("pages.authentication.token-verify-account.mail-preferences-description")}
            </p>
          </div>

          <div className="relative">
            <div className="flex max-h-72 flex-col divide-y overflow-y-auto rounded-lg border">
              {isLoadingMailTypes ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </div>
                ))
              ) : mailTypes.length === 0 ? (
                <p className="text-muted-foreground px-4 py-3 text-sm">
                  {t("pages.account.mail-preferences.empty")}
                </p>
              ) : (
                mailTypes.map((type) => (
                  <div
                    key={type.pk_driver_mail_type_id}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {t(`pages.account.mails.types.${type.label}`, {
                          defaultValue: type.label,
                        })}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t(`pages.account.mails.preferences.descriptions.${type.label}`, {
                          defaultValue: "",
                        })}
                      </p>
                    </div>
                    <Switch
                      checked={localPreferences.get(type.pk_driver_mail_type_id) ?? true}
                      disabled={updatingTypeId === type.pk_driver_mail_type_id}
                      onCheckedChange={(checked) =>
                        onTogglePreference(type.pk_driver_mail_type_id, checked)
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onContinue} className="w-full sm:w-auto">
              {t("pages.authentication.token-verify-account.access-account-button")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.token-verify-account.description")}
      </p>
      {message?.error && (
        <div className="text-warning flex flex-row gap-2">
          <TriangleAlert />
          <p>{message.error}</p>
        </div>
      )}
      {loading && <Loader />}
    </div>
  )
}

import { useAuth } from "@/app/providers/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/Button"
import { useConfig } from "@/shared/queries/config/config.queries"
import { useTranslation } from "react-i18next"

interface PageVerifyAccountProps {
  onResend: () => void
  cooldown: number
  showSupport: boolean
}

export default function PageVerifyAccount({
  onResend,
  cooldown,
  showSupport,
}: PageVerifyAccountProps) {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { t } = useTranslation()
  const { data: config } = useConfig()

  return (
    <div className="flex flex-col gap-8 sm:gap-6">
      <div className="flex flex-col gap-4">
        <p>
          {t("pages.authentication.verify-account.description", {
            driverFirstName: driver?.first_name,
          })}
        </p>
        <p className="text-muted-foreground">
          {t("pages.authentication.verify-account.mail-spam-warning")}
        </p>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-8 sm:flex-row">
        {showSupport && (
          <Button asChild variant="outline">
            <a
              href={
                "mailto:" +
                (config ? config.support_email : "contact@plannify.be") +
                "?subject=" +
                encodeURIComponent(t("pages.authentication.verify-account.email-subject")) +
                "&body=" +
                encodeURIComponent(t("pages.authentication.verify-account.email-body"))
              }
              className="w-full text-center sm:w-auto"
            >
              {t("pages.authentication.verify-account.contact-support-button")}
            </a>
          </Button>
        )}

        <div className="flex w-full flex-col justify-end gap-4 sm:ml-auto sm:w-auto sm:flex-row">
          <Button variant="outline" disabled={cooldown > 0} onClick={onResend}>
            {t("pages.authentication.verify-account.resend-button")}
            {cooldown > 0 && ` (${cooldown}s)`}
          </Button>
          <Button
            isLoading={isDeletingRefreshToken}
            onClick={(e) => {
              e.preventDefault()
              logout()
            }}
          >
            {t("pages.authentication.verify-account.logout-button")}
          </Button>
        </div>
      </div>
    </div>
  )
}

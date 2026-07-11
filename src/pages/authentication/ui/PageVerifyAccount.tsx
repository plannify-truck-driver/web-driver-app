import { useAuth } from "@/app/providers/useAuth"
import { Button } from "@/shared/components/ui/Button"
import { useConfig } from "@/shared/queries/config/config.queries"
import { useTranslation } from "react-i18next"

export default function PageVerifyAccount() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { t } = useTranslation()
  const { data: config } = useConfig()

  return (
    <div className="flex flex-col gap-4">
      <p>
        {t("pages.authentication.verify-account.description", {
          driverFirstName: driver?.first_name,
        })}
      </p>
      <p className="text-muted-foreground">
        {t("pages.authentication.verify-account.mail-spam-warning")}
      </p>
      <div className="flex flex-col justify-end gap-2 sm:flex-row">
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
          >
            {t("pages.authentication.verify-account.contact-support-button")}
          </a>
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
  )
}

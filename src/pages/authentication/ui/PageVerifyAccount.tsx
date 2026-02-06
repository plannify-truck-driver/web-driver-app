import { useAuth } from "@/app/providers/AuthProvider"
import { Button } from "@/shared/components/ui/Button"
import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export default function PageVerifyAccount() {
  const { driver, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

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
              "mailto:contact@plannify.be?subject=" +
              encodeURIComponent(t("pages.authentication.verify-account.email-subject")) +
              "&body=" +
              encodeURIComponent(t("pages.authentication.verify-account.email-body"))
            }
          >
            {t("pages.authentication.verify-account.contact-support-button")}
          </a>
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault()
            logout()
            navigate({ to: "/authentication/login" })
          }}
        >
          {t("pages.authentication.verify-account.logout-button")}
        </Button>
      </div>
    </div>
  )
}

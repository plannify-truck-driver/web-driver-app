import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import { useNavigate } from "@tanstack/react-router"
import { useConfig } from "@/shared/queries/config/config.queries"
import { useAuth } from "@/app/providers/useAuth"
import PageSupport from "../ui/PageSupport"

export default function PageSupportFeature() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: config, isLoading } = useConfig()
  const { driver } = useAuth()

  useDocumentTitle(t("pages.account.support.page-title"))

  return (
    <PageSupport
      supportEmail={config?.support_email ?? null}
      driverEmail={driver?.email ?? null}
      isLoading={isLoading}
      onBack={() => navigate({ to: "/account" })}
    />
  )
}

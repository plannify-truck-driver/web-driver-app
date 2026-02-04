import { useDocumentTitle } from "@/hooks/use-document-title"
import PageSuspended from "../ui/PageSuspended"
import { useLocation } from "@tanstack/react-router"
import type { SuspendedContent } from "@/shared/queries/auth/auth.types"
import { useTranslation } from "react-i18next"

export default function PageSuspendedFeature() {
  const { state } = useLocation() as { state: SuspendedContent }
  const { t } = useTranslation()

  useDocumentTitle(t("pages.authentication.suspended.page-title"))

  return <PageSuspended state={state} />
}

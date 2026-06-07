import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import { useNavigate } from "@tanstack/react-router"
import {
  useGetMailPreferences,
  useUpdateMailPreference,
} from "@/shared/queries/mails/mails.queries"
import PageMailPreferences from "../ui/PageMailPreferences"
import { toast } from "sonner"
import { handleErrorResponse } from "@/shared/lib/error-response"

export default function PageMailPreferencesFeature() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useDocumentTitle(t("pages.account.mail-preferences.page-title"))

  const { data: preferences = [], isLoading: isLoadingPreferences } = useGetMailPreferences()
  const {
    mutate: updatePreference,
    variables: togglingVariables,
    isPending: isToggling,
  } = useUpdateMailPreference()

  function handleTogglePreference(mailTypeId: number, isEnabled: boolean) {
    updatePreference(
      { mailTypeId, isEnabled },
      {
        onError: async (error) => {
          const apiError = await handleErrorResponse(error)
          void apiError
          toast.error(t("pages.account.mails.preferences.toggle-error"))
        },
      }
    )
  }

  return (
    <PageMailPreferences
      preferences={preferences}
      isLoading={isLoadingPreferences}
      togglingTypeId={isToggling ? (togglingVariables?.mailTypeId ?? null) : null}
      onTogglePreference={handleTogglePreference}
      onBack={() => navigate({ to: "/account/mails" })}
    />
  )
}

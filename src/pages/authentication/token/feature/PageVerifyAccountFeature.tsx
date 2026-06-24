import { useEffect, useMemo, useRef, useState } from "react"
import PageVerifyAccount from "../ui/PageVerifyAccount"
import { useTranslation } from "react-i18next"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useVerifyAccountMutation } from "@/shared/queries/auth/auth.queries"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { useAuth } from "@/app/providers/useAuth"
import {
  useGetMailPreferences,
  useGetMailTypes,
  useUpdateMailPreference,
} from "@/shared/queries/mails/mails.queries"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

export default function PageVerifyAccountFeature() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")
  const driverId = params.get("id")

  useDocumentTitle(t("pages.authentication.token-verify-account.page-title"))

  const [success, setSuccess] = useState(false)
  const [asyncError, setAsyncError] = useState("")
  const [localPreferences, setLocalPreferences] = useState<Map<number, boolean>>(new Map())
  const initializedRef = useRef(false)

  const { data: mailTypes = [], isLoading: isLoadingMailTypes } = useGetMailTypes({
    enabled: success,
  })
  const { data: preferences = [], isLoading: isLoadingPreferences } = useGetMailPreferences({
    enabled: success,
  })

  useEffect(() => {
    if (initializedRef.current || mailTypes.length === 0 || isLoadingPreferences) return

    const prefMap = new Map(preferences.map((p) => [p.mail_type_id, p.is_enabled]))

    setLocalPreferences(
      new Map(
        mailTypes
          .filter((type) => type.is_editable)
          .map((type) => [
            type.pk_driver_mail_type_id,
            prefMap.get(type.pk_driver_mail_type_id) ?? true,
          ])
      )
    )
    initializedRef.current = true
  }, [mailTypes, preferences, isLoadingPreferences])

  const {
    mutate: updatePreference,
    isPending: isUpdatingPreference,
    variables: updatingVariables,
  } = useUpdateMailPreference()

  function handleTogglePreference(mailTypeId: number, isEnabled: boolean) {
    setLocalPreferences((prev) => new Map(prev).set(mailTypeId, isEnabled))
    updatePreference(
      { mailTypeId, isEnabled },
      {
        onError: async (error) => {
          setLocalPreferences((prev) => new Map(prev).set(mailTypeId, !isEnabled))
          const apiError = await handleErrorResponse(error)
          void apiError
          toast.error(t("pages.account.mails.preferences.toggle-error"))
        },
      }
    )
  }

  const { mutateAsync, isPending } = useVerifyAccountMutation({
    onSuccess: (data) => {
      login(data.access_token)
      setSuccess(true)
    },
    onError: async (error) => {
      const apiError = await handleErrorResponse(error)
      if (apiError) {
        switch (apiError.error_code) {
          case "ACCOUNT_ALREADY_VERIFIED":
            setAsyncError(t("pages.authentication.token-verify-account.already-verified"))
            break
          case "INVALID_VERIFICATION_KEY":
            setAsyncError(t("pages.authentication.token-verify-account.invalid-verification-key"))
            break
          case "MISSING_ATTRIBUTE":
            setAsyncError(t("pages.authentication.token-verify-account.invalid-url-parameters"))
            break
        }
        console.error("API Error:", apiError)
        return
      }
      console.error("Verify account error:", error)
    },
  })

  useEffect(() => {
    if (token && driverId) {
      mutateAsync({ token, driver_id: driverId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const message = useMemo<{ success: string; error: string } | null>(() => {
    if (!token || !driverId) {
      return {
        success: "",
        error: t("pages.authentication.token-verify-account.invalid-url-parameters"),
      }
    }
    if (success) {
      return { success: t("pages.authentication.token-verify-account.success-message"), error: "" }
    }
    if (asyncError) {
      return { success: "", error: asyncError }
    }
    return null
  }, [token, driverId, success, asyncError, t])

  const editableMailTypes = mailTypes.filter((type) => type.is_editable)

  return (
    <PageVerifyAccount
      message={message}
      loading={isPending}
      mailTypes={editableMailTypes}
      isLoadingMailTypes={isLoadingMailTypes || isLoadingPreferences}
      localPreferences={localPreferences}
      updatingTypeId={isUpdatingPreference ? (updatingVariables?.mailTypeId ?? null) : null}
      onTogglePreference={handleTogglePreference}
      onContinue={() => navigate({ to: "/dashboard" })}
    />
  )
}

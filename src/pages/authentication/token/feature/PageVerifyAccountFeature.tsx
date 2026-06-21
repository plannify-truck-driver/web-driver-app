import { useEffect, useMemo, useState } from "react"
import PageVerifyAccount from "../ui/PageVerifyAccount"
import { useTranslation } from "react-i18next"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useVerifyAccountMutation } from "@/shared/queries/auth/auth.queries"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { useAuth } from "@/app/providers/useAuth"

export default function PageVerifyAccountFeature() {
  const { t } = useTranslation()
  const { login } = useAuth()

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")
  const driverId = params.get("id")

  useDocumentTitle(t("pages.authentication.token-verify-account.page-title"))

  const [success, setSuccess] = useState(false)
  const [asyncError, setAsyncError] = useState("")

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

  return <PageVerifyAccount message={message} loading={isPending} />
}

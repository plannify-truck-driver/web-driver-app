import { useEffect, useState } from "react"
import PageVerifyAccount from "../ui/PageVerifyAccount"
import { useTranslation } from "react-i18next"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useVerifyAccountMutation } from "@/shared/queries/auth/auth.queries"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { useAuth } from "@/app/providers/AuthProvider"

export default function PageVerifyAccountFeature() {
  const { t } = useTranslation()
  const { accessToken, login } = useAuth()

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")
  const driverId = params.get("id")

  useDocumentTitle(t("pages.authentication.token-verify-account.page-title"))

  const { mutateAsync, data, error, isPending } = useVerifyAccountMutation()
  const [message, setMessage] = useState<{ success: string; error: string } | null>(null)

  useEffect(() => {
    if (token && driverId) {
      mutateAsync({ token, driver_id: driverId })
    } else {
      setMessage({
        success: "",
        error: t("pages.authentication.token-verify-account.invalid-url-parameters"),
      })
    }
  }, [token, driverId, mutateAsync, t])

  useEffect(() => {
    if (data && !accessToken) {
      login(data.access_token)
      setMessage({
        success: t("pages.authentication.token-verify-account.success-message"),
        error: "",
      })
    }
  }, [data, t, login, accessToken])

  useEffect(() => {
    if (error) {
      handleErrorResponse(error).then((apiError) => {
        if (apiError) {
          switch (apiError.error_code) {
            case "ACCOUNT_ALREADY_VERIFIED":
              setMessage({
                success: t("pages.authentication.token-verify-account.already-verified"),
                error: "",
              })
              break
            case "INVALID_VERIFICATION_KEY":
              setMessage({
                success: "",
                error: t("pages.authentication.token-verify-account.invalid-verification-key"),
              })
              break
            case "MISSING_ATTRIBUTE":
              setMessage({
                success: "",
                error: t("pages.authentication.token-verify-account.invalid-url-parameters"),
              })
              break
          }
          console.error("API Error:", apiError)
        }
        console.error("Registration error:", error)
      })
    }
  }, [error, t])

  return <PageVerifyAccount message={message} loading={isPending} />
}

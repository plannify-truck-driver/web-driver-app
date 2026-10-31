import { useDocumentTitle } from "@/hooks/use-document-title"
import PageVerifyAccount from "../ui/PageVerifyAccount"
import { useTranslation } from "react-i18next"
import { useResendVerifyAccountMutation } from "@/shared/queries/auth/auth.queries"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { useAuth } from "@/app/providers/useAuth"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"

const RESEND_COOLDOWN_SECONDS = 30

export default function PageVerifyAccountFeature() {
  const { t } = useTranslation()
  const { driver, refreshToken } = useAuth()
  const navigate = useNavigate()
  const autoSentRef = useRef(false)
  const isAutoCallRef = useRef(false)

  // Seconds left before the resend button is usable again (anti-spam).
  const [cooldown, setCooldown] = useState(0)
  const [showSupport, setShowSupport] = useState(false)

  useDocumentTitle(t("pages.authentication.verify-account.page-title"))

  const { mutate } = useResendVerifyAccountMutation({
    onMutate: () => setCooldown(RESEND_COOLDOWN_SECONDS),
    onSuccess: () => toast.success(t("pages.authentication.verify-account.resend-success")),
    onError: async (error) => {
      const apiError = await handleErrorResponse(error).catch(() => undefined)
      switch (apiError?.status) {
        case 400:
          // Already verified: refresh the JWT so `driver.verified` becomes true.
          toast.info(t("pages.authentication.verify-account.resend-already-verified"))
          if (await refreshToken()) navigate({ to: "/dashboard" })
          break
        case 401:
          // Invalid refresh token: refreshToken() clears the session, root redirects to login.
          toast.error(t("pages.authentication.verify-account.resend-session-expired"))
          await refreshToken()
          break
        case 403:
          toast.error(t("pages.authentication.verify-account.resend-mail-preference-disabled"))
          break
        case 409:
          // On page load, an existing link is expected (e.g. right after registration): stay silent.
          if (isAutoCallRef.current) break
          toast.warning(t("pages.authentication.verify-account.resend-token-already-exists"))
          break
        default:
          console.error("Resend verify account error:", error)
          toast.error(t("forms.errors.unexpected-error"))
      }
    },
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const timerId = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(timerId)
  }, [cooldown])

  // Send automatically once per page visit, as soon as an unverified session is known.
  useEffect(() => {
    if (autoSentRef.current || !driver || driver.verified) return
    autoSentRef.current = true
    isAutoCallRef.current = true
    mutate()
  }, [driver, mutate])

  function handleResend() {
    if (cooldown > 0) return
    isAutoCallRef.current = false
    // A manual resend means the first mail didn't arrive: offer support from now on.
    setShowSupport(true)
    mutate()
  }

  return <PageVerifyAccount onResend={handleResend} cooldown={cooldown} showSupport={showSupport} />
}

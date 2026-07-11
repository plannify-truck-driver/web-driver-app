import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { resetPasswordFormSchema } from "@/shared/zod/reset-password"
import { useResetPasswordMutation } from "@/shared/queries/auth/auth.queries"
import { useState } from "react"
import { handleErrorResponse } from "@/shared/lib/error-response"
import PageResetPassword from "../ui/PageResetPassword"

export default function PageResetPasswordFeature() {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [mailPreferenceDisabled, setMailPreferenceDisabled] = useState<boolean>(false)

  useDocumentTitle(t("pages.authentication.reset-password.page-title"))

  const { mutateAsync, isPending } = useResetPasswordMutation({
    onSuccess: () => setSuccess(true),
    onError: async (error) => {
      const apiError = await handleErrorResponse(error)
      if (apiError) {
        switch (apiError.error_code) {
          case "DRIVER_NOT_FOUND":
            setErrorMessage("forms.reset-password.errors.driver-not-found")
            break
          case "RESET_PASSWORD_TOKEN_ALREADY_EXISTS":
            setErrorMessage("forms.reset-password.errors.token-already-exists")
            break
          case "MAIL_PREFERENCE_DISABLED":
            setMailPreferenceDisabled(true)
            break
          default:
            setErrorMessage("forms.errors.unexpected-error")
        }
        return
      }
      console.error("Reset password error:", error)
    },
  })

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    setErrorMessage(null)
    mutateAsync(values)
  }

  return (
    <PageResetPassword
      errorMessage={errorMessage}
      form={form}
      loading={isPending}
      success={success}
      mailPreferenceDisabled={mailPreferenceDisabled}
      onSubmit={onSubmit}
    />
  )
}

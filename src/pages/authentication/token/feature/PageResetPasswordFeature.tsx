import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { editPasswordFormSchema } from "@/shared/zod/edit-password"
import { useConfirmResetPasswordMutation } from "@/shared/queries/auth/auth.queries"
import { useState } from "react"
import { handleErrorResponse } from "@/shared/lib/error-response"
import PageResetPassword from "../ui/PageResetPassword"

export default function PageResetPasswordFeature() {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenInvalid, setTokenInvalid] = useState(false)

  useDocumentTitle(t("pages.authentication.token-reset-password.page-title"))

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")
  const driverId = params.get("id")
  const invalidParams = !token || !driverId

  const { mutateAsync, isPending } = useConfirmResetPasswordMutation({
    onSuccess: () => setSuccess(true),
    onError: async (error) => {
      const apiError = await handleErrorResponse(error)
      if (apiError) {
        switch (apiError.error_code) {
          case "INVALID_RESET_PASSWORD_TOKEN":
            setErrorMessage(t("forms.confirm-reset-password.errors.invalid-token"))
            setTokenInvalid(true)
            break
          default:
            setErrorMessage(t("forms.errors.unexpected-error"))
        }
        return
      }
      console.error("Confirm reset password error:", error)
    },
  })

  const form = useForm<z.infer<typeof editPasswordFormSchema>>({
    resolver: zodResolver(editPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof editPasswordFormSchema>) {
    if (!token || !driverId) return
    setErrorMessage(null)
    mutateAsync({ token, driver_id: driverId, password: values.password })
  }

  return (
    <PageResetPassword
      form={form}
      loading={isPending}
      success={success}
      errorMessage={errorMessage}
      invalidParams={invalidParams}
      tokenInvalid={tokenInvalid}
      onSubmit={onSubmit}
    />
  )
}

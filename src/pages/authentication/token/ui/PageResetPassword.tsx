import { Button } from "@/shared/components/ui/Button"
import { ConfirmResetPasswordForm } from "@/shared/forms/ConfirmResetPassword"
import type { editPasswordFormSchema } from "@/shared/zod/edit-password"
import { useNavigate } from "@tanstack/react-router"
import { TriangleAlert } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"

interface PageResetPasswordProps {
  form: UseFormReturn<z.infer<typeof editPasswordFormSchema>>
  loading: boolean
  success: boolean
  errorMessage: string | null
  invalidParams: boolean
  tokenInvalid: boolean
  onSubmit: (values: z.infer<typeof editPasswordFormSchema>) => void
}

export default function PageResetPassword({
  form,
  loading,
  success,
  errorMessage,
  invalidParams,
  tokenInvalid,
  onSubmit,
}: PageResetPasswordProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (invalidParams) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-warning flex flex-row gap-2">
          <TriangleAlert />
          <p>{t("pages.authentication.token-reset-password.invalid-url-parameters")}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm">
          {t("pages.authentication.token-reset-password.success-message")}
        </p>
        <Button
          className="mx-auto w-full max-w-sm"
          onClick={() => navigate({ to: "/authentication/login" })}
        >
          {t("pages.authentication.token-reset-password.login-button")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.token-reset-password.description")}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <ConfirmResetPasswordForm
          errorMessage={errorMessage}
          loading={loading}
          onSubmit={onSubmit}
          form={form}
          tokenInvalid={tokenInvalid}
        />
      </div>
    </div>
  )
}

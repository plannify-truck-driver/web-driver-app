import { Button } from "@/shared/components/ui/Button"
import { ResetPasswordForm } from "@/shared/forms/ResetPassword"
import { useConfig } from "@/shared/queries/config/config.queries"
import type { resetPasswordFormSchema } from "@/shared/zod/reset-password"
import { useNavigate } from "@tanstack/react-router"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"

interface PageResetPasswordProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof resetPasswordFormSchema>>
  loading: boolean
  success: boolean
  mailPreferenceDisabled: boolean
  onSubmit: (values: z.infer<typeof resetPasswordFormSchema>) => void
}

export default function PageResetPassword({
  errorMessage,
  form,
  loading,
  success,
  mailPreferenceDisabled,
  onSubmit,
}: PageResetPasswordProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: config } = useConfig()

  const supportEmail = config?.support_email ?? "contact@plannify.be"

  if (mailPreferenceDisabled) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm">{t("pages.authentication.reset-password.mail-preference-disabled-description")}</p>
        <p className="text-sm">
          {t("pages.authentication.reset-password.contact-support")}{" "}
          <a href={`mailto:${supportEmail}`} className="text-primary underline">
            {supportEmail}
          </a>
        </p>
        <Button
          variant="outline"
          className="mx-auto w-full max-w-sm"
          onClick={() => navigate({ to: "/authentication/login" })}
        >
          {t("pages.authentication.reset-password.back-to-login")}
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm">{t("pages.authentication.reset-password.success-description")}</p>
        <p className="text-muted-foreground text-sm">
          {t("pages.authentication.reset-password.mail-spam-warning")}
        </p>
        <Button
          variant="outline"
          className="mx-auto w-full max-w-sm"
          onClick={() => navigate({ to: "/authentication/login" })}
        >
          {t("pages.authentication.reset-password.back-to-login")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.reset-password.description")}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <ResetPasswordForm
          errorMessage={errorMessage}
          loading={loading}
          onSubmit={onSubmit}
          form={form}
        />
        <hr className="border-border/50 w-full border-t" />
        <div className="flex flex-row items-center gap-2 text-sm">
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate({ to: "/authentication/login" })}
          >
            {t("pages.authentication.reset-password.back-to-login")}
          </Button>
        </div>
      </div>
    </div>
  )
}

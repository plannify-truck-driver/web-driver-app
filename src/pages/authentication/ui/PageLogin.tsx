import { Button } from "@/shared/components/ui/Button"
import { Loader } from "@/shared/components/Loader"
import { LoginForm } from "@/shared/forms/Login"
import type { loginFormSchema } from "@/shared/zod/login"
import { useNavigate } from "@tanstack/react-router"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"

interface PageLoginProps {
  checkingSession: boolean
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof loginFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof loginFormSchema>) => void
}

export default function PageLogin({
  checkingSession,
  errorMessage,
  form,
  loading,
  onSubmit,
}: PageLoginProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader />
        <p className="text-muted-foreground text-sm">
          {t("pages.authentication.login.checking-session")}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.login.description")}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <LoginForm
          errorMessage={errorMessage}
          loading={loading}
          onSubmit={onSubmit}
          form={form}
          onForgotPassword={() => navigate({ to: "/authentication/reset-password" })}
        />
        <hr className="border-border/50 w-full border-t" />
        <div className="flex flex-row items-center gap-2 text-sm">
          <p>{t("pages.authentication.login.no-account-text")}</p>
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate({ to: "/authentication/registration" })}
          >
            {t("pages.authentication.login.no-account-link")}
          </Button>
        </div>
      </div>
    </div>
  )
}

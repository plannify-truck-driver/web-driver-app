import { Button } from "@/shared/components/ui/Button"
import { RegistrationForm } from "@/shared/forms/Registration"
import type { registrationFormSchema } from "@/shared/zod/registration"
import { useNavigate } from "@tanstack/react-router"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"

interface PageRegistrationProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof registrationFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof registrationFormSchema>) => void
}

export default function PageRegistration({
  errorMessage,
  form,
  loading,
  onSubmit,
}: PageRegistrationProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.registration.description")}
      </p>
      <div className="flex w-full flex-col gap-4">
        <RegistrationForm
          errorMessage={errorMessage}
          loading={loading}
          onSubmit={onSubmit}
          form={form}
        />
        <hr className="border-border/50 w-full border-t" />
        <div className="flex flex-row items-center gap-2 text-sm">
          <p>{t("pages.authentication.registration.has-account")}</p>
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate({ to: "/authentication/login" })}
          >
            {t("pages.authentication.registration.has-account-link")}
          </Button>
        </div>
      </div>
    </div>
  )
}

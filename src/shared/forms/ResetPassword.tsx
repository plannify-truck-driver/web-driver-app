import { Controller, type UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { resetPasswordFormSchema } from "../zod/reset-password"
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useTranslation } from "react-i18next"

interface ResetPasswordFormProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof resetPasswordFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof resetPasswordFormSchema>) => void
}

export function ResetPasswordForm({
  errorMessage,
  form,
  loading,
  onSubmit,
}: ResetPasswordFormProps) {
  const { t } = useTranslation()

  return (
    <form
      id="form-reset-password"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col justify-between gap-2"
    >
      <FieldGroup className="flex flex-col gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-reset-password-email">
                {t("forms.reset-password.email-label")}
              </FieldLabel>
              <Input
                {...field}
                id="form-reset-password-email"
                type="email"
                disabled={loading}
                aria-invalid={fieldState.invalid}
                placeholder={t("forms.reset-password.email-placeholder")}
                autoComplete="email"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
      {errorMessage && <p className="my-2 text-sm text-red-600">{t(errorMessage)}</p>}
      <Button type="submit" form="form-reset-password" isLoading={loading}>
        {t("forms.reset-password.submit-button")}
      </Button>
    </form>
  )
}

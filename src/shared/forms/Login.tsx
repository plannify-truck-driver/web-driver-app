import { Controller, type UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { loginFormSchema } from "../zod/login"
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useTranslation } from "react-i18next"

interface LoginFormProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof loginFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof loginFormSchema>) => void
}

export function LoginForm({ errorMessage, form, loading, onSubmit }: LoginFormProps) {
  const { t } = useTranslation()

  return (
    <form
      id="form-login"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col justify-between gap-2"
    >
      <FieldGroup className="flex flex-col gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-email">{t("forms.login.email-label")}</FieldLabel>
              <Input
                {...field}
                id="form-email"
                type="email"
                disabled={loading}
                aria-invalid={fieldState.invalid}
                placeholder={t("forms.login.email-placeholder")}
                autoComplete="on"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-password">{t("forms.login.password-label")}</FieldLabel>
              <Input
                {...field}
                id="form-password"
                type="password"
                disabled={loading}
                aria-invalid={fieldState.invalid}
                placeholder={t("forms.login.password-placeholder")}
                autoComplete="off"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
      {errorMessage && <p className="my-2 text-sm text-red-600">{errorMessage}</p>}
      <Button type="submit" form="form-login" isLoading={loading}>
        {t("forms.login.submit-button")}
      </Button>
    </form>
  )
}

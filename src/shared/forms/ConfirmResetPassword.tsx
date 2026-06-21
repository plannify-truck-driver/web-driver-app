import { Controller, type UseFormReturn } from "react-hook-form"
import type { SyntheticEvent } from "react"
import type z from "zod"
import type { editPasswordFormSchema } from "../zod/edit-password"
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { PasswordComplexityMeter } from "../components/PasswordComplexityMeter"
import { generateStrongPassword } from "../functions/generateStrongPassword"
import { useTranslation } from "react-i18next"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

interface ConfirmResetPasswordFormProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof editPasswordFormSchema>>
  loading: boolean
  tokenInvalid: boolean
  onSubmit: (values: z.infer<typeof editPasswordFormSchema>) => void
}

export function ConfirmResetPasswordForm({
  errorMessage,
  form,
  loading,
  tokenInvalid,
  onSubmit,
}: ConfirmResetPasswordFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function handleGenerateStrongPassword(e: SyntheticEvent) {
    e.preventDefault()
    if (loading) {
      toast.warning(t("forms.registration.errors.cannot-generate-password-while-loading"))
      return
    }
    const password = generateStrongPassword()
    form.setValue("password", password)
    form.setValue("confirmPassword", password)
    try {
      await navigator.clipboard.writeText(password)
      toast.info(t("forms.registration.password-copied-to-clipboard"))
    } catch (error) {
      toast.error(t("forms.registration.errors.cannot-copy-password-to-clipboard"))
      console.error("Failed to copy password to clipboard:", error)
    }
  }

  return (
    <form
      id="form-confirm-reset-password"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center justify-between gap-4"
    >
      <FieldGroup className="flex w-full flex-col gap-3">
        <div className="flex flex-col items-start">
          <div className="flex w-full flex-col gap-3">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="crp-password">
                    {t("forms.confirm-reset-password.password-label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="crp-password"
                    type="password"
                    disabled={loading}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{t(fieldState.error.message as string)}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="crp-confirm">
                    {t("forms.confirm-reset-password.confirm-password-label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="crp-confirm"
                    type="password"
                    disabled={loading}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{t(fieldState.error.message as string)}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>
          <Button variant="link" className="p-0 text-sm" onClick={handleGenerateStrongPassword}>
            {t("forms.registration.generate-strong-password-button")}
          </Button>
        </div>
        <PasswordComplexityMeter key={form.watch("password")} password={form.watch("password")} />
      </FieldGroup>
      {errorMessage && <p className="my-2 text-sm text-red-600">{errorMessage}</p>}
      {tokenInvalid ? (
        <Button
          variant="outline"
          className="w-full min-w-[10rem] sm:max-w-[20rem]"
          onClick={() => navigate({ to: "/authentication/login" })}
        >
          {t("pages.authentication.token-reset-password.login-button")}
        </Button>
      ) : (
        <Button
          type="submit"
          form="form-confirm-reset-password"
          isLoading={loading}
          className="w-full min-w-[10rem] sm:max-w-[20rem]"
        >
          {t("forms.confirm-reset-password.submit-button")}
        </Button>
      )}
    </form>
  )
}

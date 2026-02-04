import { Controller, type UseFormReturn } from "react-hook-form"
import type z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useTranslation } from "react-i18next"
import type { registrationFormSchema } from "../zod/registration"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select"
import { PasswordComplexityMeter } from "../components/PasswordComplexityMeter"
import type { SyntheticEvent } from "react"
import { generateStrongPassword } from "../functions/generateStrongPassword"
import { toast } from "sonner"

interface RegistrationFormProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof registrationFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof registrationFormSchema>) => void
}

export function RegistrationForm({ errorMessage, form, loading, onSubmit }: RegistrationFormProps) {
  const { t } = useTranslation()

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
      id="form-registration"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center justify-between gap-4"
    >
      <FieldGroup className="w-full sm:min-w-[40rem]">
        <div className="flex w-full flex-col gap-3 sm:grid sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-firstname">
                      {t("forms.registration.firstname-label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-firstname"
                      type="text"
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                      autoComplete="given-name"
                    />
                    {fieldState.invalid && fieldState.error && (
                      <FieldError>{t(fieldState.error.message as string)}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-lastname">
                      {t("forms.registration.lastname-label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-lastname"
                      type="text"
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                      autoComplete="family-name"
                    />
                    {fieldState.invalid && fieldState.error && (
                      <FieldError>{t(fieldState.error.message as string)}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-gender">
                    {t("forms.registration.gender-label")}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger
                      className="bg-background w-full sm:max-w-48"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder={t("forms.registration.gender-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("forms.registration.gender-label")}</SelectLabel>
                        <SelectItem key="M" value="M">
                          {t(`forms.registration.genders.M`)}
                        </SelectItem>
                        <SelectItem key="F" value="F">
                          {t(`forms.registration.genders.F`)}
                        </SelectItem>
                        <SelectItem key="O" value="O">
                          {t(`forms.registration.genders.O`)}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{t(fieldState.error.message as string)}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">
                    {t("forms.registration.email-label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    type="text"
                    disabled={loading}
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{t(fieldState.error.message as string)}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-3 sm:border-l sm:pl-3">
            <div className="gap flex flex-col items-start">
              <div className="flex w-full flex-col gap-3">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-password">
                        {t("forms.registration.password-label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-password"
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
                      <FieldLabel htmlFor="form-confirm-password">
                        {t("forms.registration.confirm-password-label")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-confirm-password"
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
            <PasswordComplexityMeter
              key={form.watch("password")}
              password={form.watch("password")}
            />
          </div>
        </div>
      </FieldGroup>
      {errorMessage && <p className="my-2 text-sm text-red-600">{errorMessage}</p>}
      <Button
        type="submit"
        form="form-registration"
        isLoading={loading}
        className="w-full min-w-[10rem] sm:max-w-[20rem]"
      >
        {t("forms.registration.submit-button")}
      </Button>
    </form>
  )
}

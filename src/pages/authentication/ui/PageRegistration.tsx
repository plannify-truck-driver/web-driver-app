import { Button } from "@/shared/components/ui/Button"
import { RegistrationForm } from "@/shared/forms/Registration"
import type { registrationFormSchema } from "@/shared/zod/registration"
import { useNavigate } from "@tanstack/react-router"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import { useIsMobile } from "@/hooks/use-mobile"
import { RegistrationWorkdayStep } from "./RegistrationWorkdayStep"
import { cn } from "@/lib/utils"
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/Field"
import { Input } from "@/shared/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select"
import { PasswordComplexityMeter } from "@/shared/components/PasswordComplexityMeter"
import { generateStrongPassword } from "@/shared/functions/generateStrongPassword"
import { toast } from "sonner"
import type { SyntheticEvent } from "react"

interface PageRegistrationProps {
  errorMessage: string | null
  form: UseFormReturn<z.infer<typeof registrationFormSchema>>
  loading: boolean
  onSubmit: (values: z.infer<typeof registrationFormSchema>) => void
  step: 1 | 2 | 3 | 4 | 5
  onNextStep: () => void
  onPrevStep: () => void
  workdayRowType: 1 | 2 | 3
  onWorkdayRowTypeChange: (type: 1 | 2 | 3) => void
  accountCreated: boolean
  onComplete: () => void
}

export default function PageRegistration({
  errorMessage,
  form,
  loading,
  onSubmit,
  step,
  onNextStep,
  onPrevStep,
  workdayRowType,
  onWorkdayRowTypeChange,
  accountCreated,
  onComplete,
}: PageRegistrationProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

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
    } catch {
      toast.error(t("forms.registration.errors.cannot-copy-password-to-clipboard"))
    }
  }

  if (isMobile) {
    if (step === 5) {
      return (
        <div className="flex flex-col gap-6">
          <StepIndicator current={step} total={5} />
          <RegistrationWorkdayStep
            selectedRowType={workdayRowType}
            onSelect={onWorkdayRowTypeChange}
            isCreating={loading}
          />
          <Button onClick={onComplete} disabled={!accountCreated} isLoading={loading}>
            {t("common.continue")}
          </Button>
        </div>
      )
    }

    const stepTitles: Record<1 | 2 | 3 | 4, string> = {
      1: t("pages.authentication.registration.step-name.title"),
      2: t("pages.authentication.registration.step-gender.title"),
      3: t("pages.authentication.registration.step-email.title"),
      4: t("pages.authentication.registration.step-password.title"),
    }

    return (
      <div className="flex flex-col gap-6">
        <StepIndicator current={step} total={5} />

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{stepTitles[step]}</h2>
          {step === 1 && (
            <p className="text-muted-foreground text-sm">
              {t("pages.authentication.registration.description")}
            </p>
          )}
        </div>

        <form
          id="form-registration-mobile"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mobile-form-firstname">
                      {t("forms.registration.firstname-label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="mobile-form-firstname"
                      type="text"
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                      autoComplete="given-name"
                      autoFocus
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
                    <FieldLabel htmlFor="mobile-form-lastname">
                      {t("forms.registration.lastname-label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="mobile-form-lastname"
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
          )}

          {step === 2 && (
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mobile-form-gender">
                    {t("forms.registration.gender-label")}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger
                      className="bg-background w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder={t("forms.registration.gender-placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("forms.registration.gender-label")}</SelectLabel>
                        <SelectItem value="M">{t("forms.registration.genders.M")}</SelectItem>
                        <SelectItem value="F">{t("forms.registration.genders.F")}</SelectItem>
                        <SelectItem value="O">{t("forms.registration.genders.O")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{t(fieldState.error.message as string)}</FieldError>
                  )}
                </Field>
              )}
            />
          )}

          {step === 3 && (
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mobile-form-email">
                    {t("forms.registration.email-label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="mobile-form-email"
                    type="email"
                    disabled={loading}
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    autoFocus
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{t(fieldState.error.message as string)}</FieldError>
                  )}
                </Field>
              )}
            />
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="mobile-form-password">
                      {t("forms.registration.password-label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="mobile-form-password"
                      type="password"
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      autoFocus
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
                    <FieldLabel htmlFor="mobile-form-confirm-password">
                      {t("forms.registration.confirm-password-label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="mobile-form-confirm-password"
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
              <Button
                variant="link"
                type="button"
                className="self-start p-0 text-sm"
                onClick={handleGenerateStrongPassword}
              >
                {t("forms.registration.generate-strong-password-button")}
              </Button>
              <PasswordComplexityMeter
                key={form.watch("password")}
                password={form.watch("password")}
              />
            </div>
          )}

          {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

          <div className={cn("flex gap-3", step > 1 ? "flex-row" : "flex-col")}>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onPrevStep}
                disabled={loading}
              >
                {t("common.back")}
              </Button>
            )}
            {step < 4 ? (
              <Button
                type="button"
                className={cn(step === 1 ? "w-full" : "flex-1")}
                onClick={onNextStep}
              >
                {t("common.next")}
              </Button>
            ) : (
              <Button
                type="submit"
                form="form-registration-mobile"
                isLoading={loading}
                className="flex-1"
              >
                {t("forms.registration.submit-button")}
              </Button>
            )}
          </div>

          {step === 1 && (
            <>
              <hr className="border-border/50 border-t" />
              <div className="flex flex-row items-center gap-2 text-sm">
                <p>{t("pages.authentication.registration.has-account")}</p>
                <Button
                  type="button"
                  variant="link"
                  className="p-0"
                  onClick={() => navigate({ to: "/authentication/login" })}
                >
                  {t("pages.authentication.registration.has-account-link")}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    )
  }

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

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex w-full items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            i + 1 <= current ? "bg-primary" : "bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

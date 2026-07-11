import { Controller, type UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { addRestPeriodFormSchema } from "../zod/add-rest-period"
import { Field, FieldError, FieldGroup, FieldLabel } from "../components/ui/Field"
import { TimeInput } from "../components/ui/TimeInput"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { CheckIcon, CoffeeIcon, LogOut, TimerIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { displayTime } from "../functions/displayTime"
import { calculSeconds } from "../functions/calculSeconds"

export interface AddRestPeriodFormProps {
  form: UseFormReturn<z.infer<typeof addRestPeriodFormSchema>>
  nextStart: string
  onSubmit: (values: z.infer<typeof addRestPeriodFormSchema>) => void
}

export function AddRestPeriodForm({ form, nextStart, onSubmit }: AddRestPeriodFormProps) {
  const { t } = useTranslation()
  const isEndOfDay = form.watch("isEndOfDay")
  const [restMinsDisplay, setRestMinsDisplay] = useState<string>(() =>
    String(form.getValues("restMins") ?? 0)
  )

  const handleSubmit = form.handleSubmit((values) => {
    if (!values.isEndOfDay) {
      if (!values.end || values.end.trim() === "") {
        form.setError("end", {
          message: t("pages.settings.rest-preferences.dialog.end-required"),
        })
        return
      }
      if (calculSeconds(values.end) <= calculSeconds(nextStart)) {
        form.setError("end", {
          message: t("pages.settings.rest-preferences.dialog.end-after-start", {
            start: displayTime(nextStart, true),
          }),
        })
        return
      }
    }
    onSubmit(values)
  })

  return (
    <form id="form-add-rest-period" onSubmit={handleSubmit} className="flex flex-col gap-8">
      <FieldGroup className="flex flex-col gap-5">
        <Field>
          <FieldLabel className="text-muted-foreground flex items-center gap-1 text-sm font-light">
            <TimerIcon size={14} />
            {t("pages.settings.rest-preferences.dialog.from-label")}
            <span className="text-muted-foreground/60 text-xs">
              — {t("pages.settings.rest-preferences.dialog.from-auto")}
            </span>
          </FieldLabel>
          <TimeInput value={nextStart.substring(0, 5)} disabled />
        </Field>

        <Controller
          name="end"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-muted-foreground flex items-center gap-1 text-sm font-light">
                <LogOut size={14} />
                {t("pages.settings.rest-preferences.dialog.to-label")}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <TimeInput
                  value={isEndOfDay ? "23:59" : (field.value ?? "")}
                  onChange={(v) => {
                    field.onChange(v)
                    form.setValue("isEndOfDay", false)
                    form.clearErrors("end")
                  }}
                  disabled={isEndOfDay}
                  aria-invalid={fieldState.invalid}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("isEndOfDay", !isEndOfDay)
                    form.clearErrors("end")
                  }}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center rounded-md border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                    isEndOfDay
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {t("pages.settings.rest-preferences.dialog.to-end-of-day")}
                </button>
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="restMins"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-muted-foreground flex items-center gap-1 text-sm font-light">
                <CoffeeIcon size={14} />
                {t("pages.settings.rest-preferences.dialog.rest-label")}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id="form-rest-mins"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={restMinsDisplay}
                  onChange={(e) => {
                    const raw = e.target.value
                    setRestMinsDisplay(raw)
                    if (raw === "") {
                      field.onChange(0)
                    } else {
                      field.onChange(Math.max(0, Math.floor(parseFloat(raw) || 0)))
                    }
                  }}
                  onFocus={() => setRestMinsDisplay(field.value === 0 ? "" : String(field.value))}
                  onBlur={() => setRestMinsDisplay(String(field.value))}
                  className="w-16 text-center"
                />
                <span className="text-muted-foreground text-sm">
                  {t("pages.settings.rest-preferences.dialog.rest-unit")}
                </span>
              </div>
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full py-5">
        <CheckIcon />
        {t("pages.settings.rest-preferences.dialog.add")}
      </Button>
    </form>
  )
}

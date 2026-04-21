import { useEffect, useMemo, useRef, useState } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { Field, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Switch } from "../components/ui/Switch"
import { TimeInput } from "../components/ui/TimeInput"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover"
import { Calendar } from "../components/ui/Calendar"
import { CalendarIcon, CheckIcon, LogIn, LogOut, StarIcon, Timer } from "lucide-react"
import { fr, enUS } from "react-day-picker/locale"
import { getWeek } from "../functions/getWeek"
import { cn } from "@/lib/utils"
import { Button } from "../components/ui/Button"
import type { RestPeriod } from "../models/rest-period"
import { displayDuration } from "../functions/displayDuration"
import { getBestRestPeriod } from "../functions/getBestRestPeriod"
import { Skeleton } from "../components/ui/Skeleton"
export interface AddWorkdayFormLoadings {
  isSubmitting: boolean
  isGetRestPeriodsLoading: boolean
}

interface AddWorkdayFormProps {
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  restPeriods: RestPeriod[]
  loadings: AddWorkdayFormLoadings
  errorMessage: string | null
  onSubmit: (values: z.infer<typeof addWorkdayFormSchema>) => void
}

export function AddWorkdayForm({
  form,
  restPeriods,
  loadings,
  errorMessage,
  onSubmit,
}: AddWorkdayFormProps) {
  const { t, i18n } = useTranslation()

  const [dateOpen, setDateOpen] = useState(false)
  const calendarLocale = i18n.language.startsWith("fr") ? fr : enUS

  const dateValue = form.watch("date")
  const startTimeValue = form.watch("startTime")
  const endTimeValue = form.watch("endTime")

  const selectedWeek = useMemo(() => {
    return getWeek(dateValue || new Date())
  }, [dateValue])
  const isRestPeriodsAvailable = useMemo(() => {
    return startTimeValue.trim() !== "" && endTimeValue?.trim() !== ""
  }, [startTimeValue, endTimeValue])

  const bestRestTime = useMemo(() => {
    if (!isRestPeriodsAvailable || restPeriods.length === 0) return null
    return getBestRestPeriod(startTimeValue, endTimeValue!, restPeriods)
  }, [startTimeValue, endTimeValue, restPeriods, isRestPeriodsAvailable])

  const userOverrideRef = useRef(false)

  useEffect(() => {
    userOverrideRef.current = false
  }, [startTimeValue, endTimeValue])

  useEffect(() => {
    if (bestRestTime !== null && !userOverrideRef.current) {
      form.setValue("restTime", bestRestTime)
    }
  }, [form, bestRestTime])

  return (
    <form
      id="form-add-workday"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <FieldGroup className="flex flex-col gap-5">
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="form-date" className="text-muted-foreground text-sm font-light">
                {t("forms.add-workday.date-label")}
              </FieldLabel>
              <div className="flex flex-row items-center gap-2">
                <div className="flex w-full flex-row gap-2 overflow-x-auto">
                  {Array.from({ length: 7 }, (_, i) => {
                    const day = new Date(selectedWeek.from)
                    day.setDate(selectedWeek.from.getDate() + i)
                    return (
                      <button
                        key={i}
                        className={cn(
                          "border-border flex h-14 w-12 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border",
                          day.getTime() === dateValue.getTime() ? "text-secondary bg-primary" : ""
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          field.onChange(day)
                        }}
                      >
                        <span
                          className={cn(
                            "text-xs font-light",
                            day.getTime() === dateValue.getTime()
                              ? "text-secondary"
                              : "text-muted-foreground"
                          )}
                        >
                          {day.toLocaleDateString(i18n.language, { weekday: "short" })}
                        </span>
                        <p className="font-bold">{day.getDate()}</p>
                      </button>
                    )
                  })}
                </div>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger className="flex h-14 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md border">
                    <CalendarIcon size={16} />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      defaultMonth={field.value}
                      captionLayout="dropdown"
                      weekStartsOn={1}
                      locale={calendarLocale}
                      onSelect={(date) => {
                        field.onChange(date)
                        setDateOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="startTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-start-time"
                  className="text-muted-foreground flex items-center gap-1 text-sm font-light"
                >
                  <LogIn size={14} />
                  {t("forms.add-workday.start-time-label")}
                </FieldLabel>
                <TimeInput
                  id="form-start-time"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loadings.isSubmitting}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
          <Controller
            name="endTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-end-time"
                  className="text-muted-foreground flex items-center gap-1 text-sm font-light"
                >
                  <LogOut size={14} />
                  {t("forms.add-workday.end-time-label")}
                  <span className="text-muted-foreground/60 text-xs">
                    · {t("forms.add-workday.optional")}
                  </span>
                </FieldLabel>
                <TimeInput
                  id="form-end-time"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  disabled={loadings.isSubmitting}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Controller
            name="restTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="form-rest-time"
                  className="text-muted-foreground flex items-center gap-1 text-sm font-light"
                >
                  <Timer size={14} />
                  {t("forms.add-workday.rest-time-label")}
                </FieldLabel>
                <div className="flex flex-row flex-wrap items-center gap-2">
                  {loadings.isGetRestPeriodsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-16 rounded-md" />
                    ))
                  ) : restPeriods.length > 0 ? (
                    restPeriods.map((period) => {
                      const isSelected = field.value === period.rest
                      const isBest = bestRestTime === period.rest
                      return (
                        <button
                          key={period.rest}
                          onClick={(e) => {
                            e.preventDefault()
                            userOverrideRef.current = true
                            field.onChange(period.rest)
                          }}
                          className={cn(
                            "border-border relative cursor-pointer rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50",
                            isSelected && "border-primary bg-primary/10 text-primary"
                          )}
                          disabled={loadings.isGetRestPeriodsLoading || !isRestPeriodsAvailable}
                        >
                          {isBest && (
                            <span className="bg-primary absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full">
                              <StarIcon size={8} fill="currentColor" className="text-white" />
                            </span>
                          )}
                          {displayDuration(period.rest, t)}
                        </button>
                      )
                    })
                  ) : (
                    <TimeInput
                      id="form-end-time"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={loadings.isSubmitting || !isRestPeriodsAvailable}
                      aria-invalid={fieldState.invalid}
                    />
                  )}
                </div>
              </Field>
            )}
          />
          {!loadings.isGetRestPeriodsLoading && restPeriods.length > 0 && (
            <p className="text-muted-foreground text-sm">
              <Trans
                i18nKey="forms.add-workday.rest-description"
                components={{
                  accountSettingsLink: <span className="text-primary underline" />,
                }}
              />
            </p>
          )}
        </div>
        <Controller
          name="overnight"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-overnight">
                {t("forms.add-workday.overnight-rest-label")}
              </FieldLabel>
              <Switch
                id="form-overnight"
                disabled={loadings.isSubmitting}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Field>
          )}
        />
      </FieldGroup>
      {errorMessage && <p className="my-2 text-sm text-red-600">{errorMessage}</p>}
      <Button
        type="submit"
        disabled={loadings.isSubmitting}
        isLoading={loadings.isSubmitting}
        className="w-full py-5"
      >
        <CheckIcon />
        {t("forms.add-workday.submit-button")}
      </Button>
    </form>
  )
}

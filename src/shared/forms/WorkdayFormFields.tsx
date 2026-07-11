import { useEffect, useMemo, useRef } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { LogIn, LogOut, StarIcon, Timer } from "lucide-react"
import { Field, FieldLabel } from "../components/ui/Field"
import { Switch } from "../components/ui/Switch"
import { TimeInput } from "../components/ui/TimeInput"
import { Skeleton } from "../components/ui/Skeleton"
import { displayDuration } from "../functions/displayDuration"
import { getBestRestPeriod } from "../functions/getBestRestPeriod"
import { cn } from "@/lib/utils"
import type { RestPeriod } from "../models/rest-period"

export type WorkdayFieldValues = {
  startTime: string
  endTime?: string
  restTime?: string
  overnight: boolean
}

interface WorkdayFormFieldsProps {
  form: UseFormReturn<WorkdayFieldValues>
  restPeriods: RestPeriod[]
  isLoadingRestPeriods: boolean
  disabled: boolean
  showRestDescription?: boolean
}

export function WorkdayFormFields({
  form,
  restPeriods,
  isLoadingRestPeriods,
  disabled,
  showRestDescription = false,
}: WorkdayFormFieldsProps) {
  const { t } = useTranslation()

  const startTimeValue = form.watch("startTime")
  const endTimeValue = form.watch("endTime")

  const isRestPeriodsAvailable = startTimeValue.trim() !== "" && (endTimeValue?.trim() ?? "") !== ""

  const bestRestTime = useMemo(() => {
    if (!isRestPeriodsAvailable || restPeriods.length === 0) return null
    return getBestRestPeriod(startTimeValue, endTimeValue!, restPeriods)
  }, [startTimeValue, endTimeValue, restPeriods, isRestPeriodsAvailable])

  const userOverrideRef = useRef(false)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (startTimeValue === "" && endTimeValue === "") return
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      // If restTime is already set (loaded from server), preserve it
      if (form.getValues("restTime")) {
        userOverrideRef.current = true
      }
      return
    }
    userOverrideRef.current = false
  }, [startTimeValue, endTimeValue, form])

  useEffect(() => {
    if (bestRestTime !== null && !userOverrideRef.current) {
      form.setValue("restTime", bestRestTime)
    }
  }, [form, bestRestTime])

  useEffect(() => {
    if (endTimeValue?.trim() === "") {
      form.setValue("restTime", "")
    }
  }, [endTimeValue, form])

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="startTime"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="wf-start-time"
                className="text-muted-foreground flex items-center gap-1 text-sm font-light"
              >
                <LogIn size={14} />
                {t("forms.add-workday.start-time-label")}
              </FieldLabel>
              <TimeInput
                id="wf-start-time"
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
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
                htmlFor="wf-end-time"
                className="text-muted-foreground flex items-center gap-1 text-sm font-light"
              >
                <LogOut size={14} />
                {t("forms.add-workday.end-time-label")}
                <span className="text-muted-foreground/60 text-xs">
                  · {t("forms.add-workday.optional")}
                </span>
              </FieldLabel>
              <TimeInput
                id="wf-end-time"
                value={field.value ?? ""}
                onChange={field.onChange}
                disabled={disabled}
                clearable
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
                htmlFor="wf-rest-time"
                className="text-muted-foreground flex items-center gap-1 text-sm font-light"
              >
                <Timer size={14} />
                {t("forms.add-workday.rest-time-label")}
              </FieldLabel>
              <div className="flex flex-row flex-wrap items-center gap-2">
                {isLoadingRestPeriods ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-16 rounded-md" />
                  ))
                ) : restPeriods.length > 0 ? (
                  <>
                    {restPeriods
                      .filter(
                        (period, index, self) =>
                          self.findIndex((p) => p.rest === period.rest) === index
                      )
                      .map((period) => {
                        const isSelected = field.value?.slice(0, 5) === period.rest.slice(0, 5)
                        const isBest = bestRestTime?.slice(0, 5) === period.rest.slice(0, 5)
                        return (
                          <button
                            key={period.rest}
                            type="button"
                            onClick={() => {
                              userOverrideRef.current = true
                              field.onChange(period.rest)
                            }}
                            className={cn(
                              "border-border relative cursor-pointer rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50",
                              isSelected && "border-primary bg-primary/10 text-primary"
                            )}
                            disabled={isLoadingRestPeriods || !isRestPeriodsAvailable || disabled}
                          >
                            {isBest && (
                              <span className="bg-primary absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full">
                                <StarIcon size={8} fill="currentColor" className="text-white" />
                              </span>
                            )}
                            {displayDuration(period.rest, t)}
                          </button>
                        )
                      })}
                    {field.value &&
                      !restPeriods.some((p) => p.rest.slice(0, 5) === field.value?.slice(0, 5)) && (
                        <span className="border-primary bg-primary/10 text-primary rounded-md border px-3 py-1 text-sm">
                          {displayDuration(field.value, t)}
                        </span>
                      )}
                  </>
                ) : (
                  <TimeInput
                    id="wf-rest-time"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={disabled || !isRestPeriodsAvailable}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              </div>
            </Field>
          )}
        />
        {showRestDescription && !isLoadingRestPeriods && restPeriods.length > 0 && (
          <p className="text-muted-foreground text-sm">
            <Trans
              i18nKey="forms.add-workday.rest-description"
              components={{ accountSettingsLink: <span className="text-primary underline" /> }}
            />
          </p>
        )}
      </div>

      <Controller
        name="overnight"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="wf-overnight">
              {t("forms.add-workday.overnight-rest-label")}
            </FieldLabel>
            <Switch
              id="wf-overnight"
              disabled={disabled}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </Field>
        )}
      />
    </>
  )
}

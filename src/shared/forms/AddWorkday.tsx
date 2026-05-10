import { useMemo, useState } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { Field, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover"
import { Calendar } from "../components/ui/Calendar"
import { CalendarIcon, CheckIcon, LockIcon } from "lucide-react"
import { fr, enUS } from "react-day-picker/locale"
import { getWeek } from "../functions/getWeek"
import { cn } from "@/lib/utils"
import { Button } from "../components/ui/Button"
import type { RestPeriod } from "../models/rest-period"
import { WorkdayFormFields, type WorkdayFieldValues } from "./WorkdayFormFields"

export interface AddWorkdayFormLoadings {
  isSubmitting: boolean
  isUpdatingWorkday: boolean
  isGetRestPeriodsLoading: boolean
}

interface AddWorkdayFormProps {
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  restPeriods: RestPeriod[]
  loadings: AddWorkdayFormLoadings
  errorCode: string | null
  onSubmit: (values: z.infer<typeof addWorkdayFormSchema>) => void
  onReplaceExistingWorkday: () => void
  onRestoreGarbageWorkday: () => void
  undoErrorCode: () => void
}

export function AddWorkdayForm({
  form,
  restPeriods,
  loadings,
  errorCode,
  onSubmit,
  onReplaceExistingWorkday,
  onRestoreGarbageWorkday,
  undoErrorCode,
}: AddWorkdayFormProps) {
  const { t, i18n } = useTranslation()

  const [dateOpen, setDateOpen] = useState(false)
  const calendarLocale = i18n.language.startsWith("fr") ? fr : enUS

  const dateValue = form.watch("date")

  const selectedWeek = useMemo(() => {
    return getWeek(dateValue || new Date())
  }, [dateValue])

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
                          "border-border flex h-14 w-12 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-50",
                          day.getTime() === dateValue.getTime() ? "bg-primary text-white" : ""
                        )}
                        disabled={
                          loadings.isSubmitting ||
                          loadings.isUpdatingWorkday ||
                          [
                            "WORKDAY_ALREADY_EXISTS",
                            "WORKDAY_GARBAGE_ALREADY_EXISTS",
                            "WORKDAY_DOCUMENT_ALREADY_GENERATED",
                          ].includes(errorCode ?? "")
                        }
                        onClick={(e) => {
                          e.preventDefault()
                          field.onChange(day)
                        }}
                      >
                        <span
                          className={cn(
                            "text-xs font-light",
                            day.getTime() === dateValue.getTime()
                              ? "text-white"
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
                  <PopoverTrigger
                    className="flex h-14 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={
                      loadings.isSubmitting ||
                      loadings.isUpdatingWorkday ||
                      [
                        "WORKDAY_ALREADY_EXISTS",
                        "WORKDAY_GARBAGE_ALREADY_EXISTS",
                        "WORKDAY_DOCUMENT_ALREADY_GENERATED",
                      ].includes(errorCode ?? "")
                    }
                  >
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
        {errorCode ? (
          errorCode === "WORKDAY_ALREADY_EXISTS" ? (
            <p className="text-center">{t("forms.add-workday.errors.workday-already-exists")}</p>
          ) : errorCode === "WORKDAY_GARBAGE_ALREADY_EXISTS" ? (
            <p className="text-center">
              {t("forms.add-workday.errors.workday-garbage-already-exists")}
            </p>
          ) : errorCode === "WORKDAY_DOCUMENT_ALREADY_GENERATED" ? (
            <div className="from-destructive/5 to-destructive/10 relative flex items-start gap-3 overflow-hidden rounded-xl border bg-gradient-to-br p-4 pr-4 sm:items-center">
              <div className="bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                <LockIcon className="text-destructive size-4" />
              </div>
              <p className="text-sm leading-relaxed">
                {t("pages.workdays.errors.workday-document-already-generated", {
                  month: dateValue.toLocaleDateString(i18n.language, { month: "long" }),
                  year: dateValue.getFullYear(),
                })}
              </p>
            </div>
          ) : (
            <p className="text-center">{t("forms.add-workday.errors.generic")}</p>
          )
        ) : (
          <WorkdayFormFields
            form={form as unknown as UseFormReturn<WorkdayFieldValues>}
            restPeriods={restPeriods}
            isLoadingRestPeriods={loadings.isGetRestPeriodsLoading}
            disabled={loadings.isSubmitting}
            showRestDescription
          />
        )}
      </FieldGroup>
      {errorCode ? (
        errorCode === "WORKDAY_ALREADY_EXISTS" ? (
          <div className="flex flex-row items-center justify-center gap-4">
            <Button variant="outline" className="flex-1 py-5" onClick={undoErrorCode}>
              {t("forms.add-workday.no")}
            </Button>
            <Button
              variant="default"
              className="flex-1 py-5"
              onClick={onReplaceExistingWorkday}
              isLoading={loadings.isUpdatingWorkday}
            >
              {t("forms.add-workday.yes")}
            </Button>
          </div>
        ) : errorCode === "WORKDAY_GARBAGE_ALREADY_EXISTS" ? (
          <div className="flex flex-row items-center justify-center gap-4">
            <Button variant="outline" className="flex-1 py-5" onClick={undoErrorCode}>
              {t("forms.add-workday.no")}
            </Button>
            <Button
              variant="default"
              className="flex-1 py-5"
              onClick={onRestoreGarbageWorkday}
              isLoading={loadings.isUpdatingWorkday}
            >
              {t("forms.add-workday.yes")}
            </Button>
          </div>
        ) : errorCode === "WORKDAY_DOCUMENT_ALREADY_GENERATED" ? (
          <div className="flex flex-row items-center justify-center gap-4">
            <Button variant="outline" className="flex-1 py-5" onClick={undoErrorCode}>
              {t("forms.add-workday.okay")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center gap-4">
            <Button variant="outline" className="flex-1 py-5" onClick={undoErrorCode}>
              {t("forms.add-workday.generic-error-undo")}
            </Button>
          </div>
        )
      ) : (
        <Button
          type="submit"
          disabled={loadings.isSubmitting}
          isLoading={loadings.isSubmitting}
          className="w-full py-5"
        >
          <CheckIcon />
          {t("forms.add-workday.submit-button")}
        </Button>
      )}
    </form>
  )
}

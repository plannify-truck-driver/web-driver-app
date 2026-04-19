import { useMemo, useState } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Input } from "../components/ui/Input"
import { Switch } from "../components/ui/Switch"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover"
import { Calendar } from "../components/ui/Calendar"
import { CalendarIcon } from "lucide-react"
import { fr, enUS } from "react-day-picker/locale"
import { getWeek } from "../functions/getWeek"
import { cn } from "@/lib/utils"

interface AddWorkdayFormProps {
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  loading: boolean
  errorMessage: string | null
  onSubmit: (values: z.infer<typeof addWorkdayFormSchema>) => void
}

export function AddWorkdayForm({ form, loading, errorMessage, onSubmit }: AddWorkdayFormProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const [hasEndTime, setHasEndTime] = useState(false)
  const { i18n } = useTranslation()
  const calendarLocale = i18n.language.startsWith("fr") ? fr : enUS

  const dateValue = form.watch("date")
  const selectedWeek = useMemo(() => {
    return getWeek(dateValue || new Date())
  }, [dateValue])

  return (
    <form id="form-add-workday" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <FieldLabel htmlFor="form-date">Date</FieldLabel>
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
          <Controller
            name="startTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-start-time">Début</FieldLabel>
                <Input
                  {...field}
                  id="form-start-time"
                  type="time"
                  disabled={loading}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Field orientation="horizontal" data-invalid={false} className="flex flex-row gap-2">
            <input
              id="form-has-end-time"
              type="checkbox"
              disabled={loading}
              checked={hasEndTime}
              onChange={(e) => {
                setHasEndTime(e.target.checked)
                if (!e.target.checked) {
                  form.setValue("endTime", undefined)
                  form.setValue("restTime", undefined)
                }
              }}
            />
            <div>
              <FieldLabel htmlFor="form-has-end-time">Saisir une heure de fin</FieldLabel>
              <FieldDescription>Cette journée possède une heure de fin connue.</FieldDescription>
            </div>
          </Field>
          {hasEndTime && (
            <div className="ml-6 flex flex-col gap-4">
              <Controller
                name="endTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-end-time">Fin</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="form-end-time"
                      type="time"
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
              <Controller
                name="restTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rest-time">Coupure</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="form-rest-time"
                      type="time"
                      disabled={loading}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
            </div>
          )}
        </div>
        <Controller
          name="overnight"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal" data-invalid={false}>
              <FieldLabel htmlFor="form-overnight">Repos nocturne</FieldLabel>
              <Switch
                id="form-overnight"
                disabled={loading}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Field>
          )}
        />
      </FieldGroup>
      {errorMessage && <p className="my-2 text-sm text-red-600">{errorMessage}</p>}
    </form>
  )
}

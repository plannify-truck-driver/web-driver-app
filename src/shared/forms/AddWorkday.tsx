import { useMemo, useState } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { Field, FieldGroup, FieldLabel } from "../components/ui/Field"
import { Switch } from "../components/ui/Switch"
import { TimeInput } from "../components/ui/TimeInput"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover"
import { Calendar } from "../components/ui/Calendar"
import { CalendarIcon, CheckIcon, LogIn, LogOut, Timer } from "lucide-react"
import { fr, enUS } from "react-day-picker/locale"
import { getWeek } from "../functions/getWeek"
import { cn } from "@/lib/utils"
import { Button } from "../components/ui/Button"

interface AddWorkdayFormProps {
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  loading: boolean
  errorMessage: string | null
  onSubmit: (values: z.infer<typeof addWorkdayFormSchema>) => void
}

function formatRestTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${m}`
}

export function AddWorkdayForm({ form, loading, errorMessage, onSubmit }: AddWorkdayFormProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const { i18n } = useTranslation()
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
                Date
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
                  Début
                </FieldLabel>
                <TimeInput
                  id="form-start-time"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
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
                  Fin
                  <span className="text-muted-foreground/60 text-xs">· facultatif</span>
                </FieldLabel>
                <TimeInput
                  id="form-end-time"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  disabled={loading}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
        <Controller
          name="restTime"
          control={form.control}
          render={({ field }) => (
            <Field data-invalid={false}>
              <FieldLabel
                htmlFor="form-rest-time"
                className="text-muted-foreground flex items-center gap-1 text-sm font-light"
              >
                <Timer size={14} />
                Pause
              </FieldLabel>
              <div className="flex flex-row flex-wrap items-center gap-2">
                {[
                  "00:00",
                  "00:15",
                  "00:30",
                  "00:45",
                  "01:00",
                  "01:15",
                  "01:30",
                  "01:45",
                  "02:00",
                ].map((time) => (
                  <Button
                    key={time}
                    variant={field.value === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => field.onChange(time)}
                    disabled={loading}
                  >
                    {formatRestTime(time)}
                  </Button>
                ))}
              </div>
            </Field>
          )}
        />
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
      <Button type="submit" disabled={loading} className="w-full py-5">
        <CheckIcon />
        {loading ? "Enregistrement..." : "Enregistrer la journée"}
      </Button>
    </form>
  )
}

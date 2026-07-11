import { Controller, type UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type z from "zod"
import type { endWorkdayRestSchema } from "@/shared/zod/end-workday-rest"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/Dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/Field"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { CoffeeIcon } from "lucide-react"

interface EndWorkdayRestDialogProps {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof endWorkdayRestSchema>>
  onClose: () => void
  onSubmit: (values: z.infer<typeof endWorkdayRestSchema>) => void
}

export function EndWorkdayRestDialog({
  isOpen,
  form,
  onClose,
  onSubmit,
}: EndWorkdayRestDialogProps) {
  const { t } = useTranslation()
  const [restMinsDisplay, setRestMinsDisplay] = useState<string>(() =>
    String(form.getValues("restMins") ?? 0)
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>{t("components.end-workday-rest-dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("components.end-workday-rest-dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form
          id="form-end-workday-rest"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FieldGroup>
            <Controller
              name="restMins"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-muted-foreground flex items-center gap-1 text-sm font-light">
                    <CoffeeIcon size={14} />
                    {t("components.end-workday-rest-dialog.rest-label")}
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
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
                      {t("components.end-workday-rest-dialog.rest-unit")}
                    </span>
                  </div>
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setValue("restMins", 0)
                setRestMinsDisplay("0")
                form.handleSubmit(onSubmit)()
              }}
            >
              {t("components.end-workday-rest-dialog.no-break")}
            </Button>
            <Button type="submit">{t("components.end-workday-rest-dialog.confirm")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

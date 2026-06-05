import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { Controller, type UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { editEmailFormSchema } from "@/shared/zod/edit-email"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/Field"
import { Input } from "./ui/Input"
import { Button } from "./ui/Button"
import { XIcon, TriangleAlertIcon } from "lucide-react"

interface EditEmailDialogProps {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof editEmailFormSchema>>
  isLoading: boolean
  setIsOpen: (state: boolean) => void
  onSubmit: (values: z.infer<typeof editEmailFormSchema>) => void
}

function EditEmailForm({
  form,
  isLoading,
  onSubmit,
}: Pick<EditEmailDialogProps, "form" | "isLoading" | "onSubmit">) {
  const { t } = useTranslation()

  return (
    <form
      id="form-edit-email"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/20 dark:text-amber-400">
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
        <p>{t("components.edit-email-dialog.unverification-warning")}</p>
      </div>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ee-email">{t("forms.registration.email-label")}</FieldLabel>
              <Input
                {...field}
                id="ee-email"
                type="email"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
                autoComplete="email"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" form="form-edit-email" isLoading={isLoading} className="w-full">
        {t("forms.edit-personal-information.submit-button")}
      </Button>
    </form>
  )
}

export function EditEmailDialog({
  isOpen,
  form,
  isLoading,
  setIsOpen,
  onSubmit,
}: EditEmailDialogProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("components.edit-email-dialog.title")}</DialogTitle>
            <DialogDescription>{t("components.edit-email-dialog.description")}</DialogDescription>
          </DialogHeader>
          <EditEmailForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{t("components.edit-email-dialog.title")}</DrawerTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1"
          >
            <XIcon size={16} />
          </button>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <EditEmailForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

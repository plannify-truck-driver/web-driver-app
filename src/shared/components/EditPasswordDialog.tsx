import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { Controller, type UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { editPasswordFormSchema } from "@/shared/zod/edit-password"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/Field"
import { Input } from "./ui/Input"
import { Button } from "./ui/Button"
import { PasswordComplexityMeter } from "./PasswordComplexityMeter"
import { XIcon } from "lucide-react"

interface EditPasswordDialogProps {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof editPasswordFormSchema>>
  isLoading: boolean
  setIsOpen: (state: boolean) => void
  onSubmit: (values: z.infer<typeof editPasswordFormSchema>) => void
}

function EditPasswordForm({
  form,
  isLoading,
  onSubmit,
}: Pick<EditPasswordDialogProps, "form" | "isLoading" | "onSubmit">) {
  const { t } = useTranslation()

  return (
    <form
      id="form-edit-password"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="epw-password">
                {t("forms.edit-password.new-password-label")}
              </FieldLabel>
              <Input
                {...field}
                id="epw-password"
                type="password"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
        <PasswordComplexityMeter key={form.watch("password")} password={form.watch("password")} />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="epw-confirm">
                {t("forms.edit-password.confirm-password-label")}
              </FieldLabel>
              <Input
                {...field}
                id="epw-confirm"
                type="password"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" form="form-edit-password" isLoading={isLoading} className="w-full">
        {t("forms.edit-password.submit-button")}
      </Button>
    </form>
  )
}

export function EditPasswordDialog({
  isOpen,
  form,
  isLoading,
  setIsOpen,
  onSubmit,
}: EditPasswordDialogProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("components.edit-password-dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("components.edit-password-dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <EditPasswordForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{t("components.edit-password-dialog.title")}</DrawerTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1"
          >
            <XIcon size={16} />
          </button>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <EditPasswordForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

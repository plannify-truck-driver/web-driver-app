import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { Controller, type UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { editProfileFormSchema } from "@/shared/zod/edit-profile"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/Field"
import { Input } from "./ui/Input"
import { Button } from "./ui/Button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select"
import { XIcon } from "lucide-react"
import { PhoneInput } from "./ui/PhoneInput"
import { useDefaultPhoneCountry } from "@/hooks/use-default-phone-country"

interface EditProfileDialogProps {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof editProfileFormSchema>>
  isLoading: boolean
  setIsOpen: (state: boolean) => void
  onSubmit: (values: z.infer<typeof editProfileFormSchema>) => void
}

function EditProfileForm({
  form,
  isLoading,
  onSubmit,
}: Pick<EditProfileDialogProps, "form" | "isLoading" | "onSubmit">) {
  const { t } = useTranslation()
  const defaultCountry = useDefaultPhoneCountry()

  return (
    <form
      id="form-edit-profile"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Controller
            name="firstname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="ep-firstname">
                  {t("forms.registration.firstname-label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="ep-firstname"
                  type="text"
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                  autoComplete="given-name"
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
                <FieldLabel htmlFor="ep-lastname">
                  {t("forms.registration.lastname-label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="ep-lastname"
                  type="text"
                  disabled={isLoading}
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
        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ep-gender">{t("forms.registration.gender-label")}</FieldLabel>
              <Select
                name={field.name}
                value={field.value ?? ""}
                onValueChange={(val) => field.onChange(val === "" ? null : val)}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="ep-gender"
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
        <Controller
          name="phone_number"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="ep-phone">
                {t("forms.edit-personal-information.phone-number-label")}
              </FieldLabel>
              <PhoneInput
                onChange={(value) => field.onChange(value || null)}
                value={field.value || undefined}
                defaultCountry={defaultCountry}
                id="ep-phone"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
                autoComplete="tel"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{t(fieldState.error.message as string)}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" form="form-edit-profile" isLoading={isLoading} className="w-full">
        {t("forms.edit-personal-information.submit-button")}
      </Button>
    </form>
  )
}

export function EditProfileDialog({
  isOpen,
  form,
  isLoading,
  setIsOpen,
  onSubmit,
}: EditProfileDialogProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("components.edit-profile-dialog.title")}</DialogTitle>
            <DialogDescription>{t("components.edit-profile-dialog.description")}</DialogDescription>
          </DialogHeader>
          <EditProfileForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{t("components.edit-profile-dialog.title")}</DrawerTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1"
          >
            <XIcon size={16} />
          </button>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <EditProfileForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

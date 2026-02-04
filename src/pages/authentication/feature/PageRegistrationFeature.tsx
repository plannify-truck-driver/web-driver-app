import { useDocumentTitle } from "@/hooks/use-document-title"
import PageRegistration from "../ui/PageRegistration"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import type z from "zod"
import { registrationFormSchema } from "@/shared/zod/registration"
import { zodResolver } from "@hookform/resolvers/zod"
import { isPasswordStrong } from "@/shared/functions/isPasswordStrong"
import { useRegistrationMutation } from "@/shared/queries/auth/auth.queries"
import { useEffect, useState } from "react"
import { handleErrorResponse } from "@/shared/lib/error-response"

export default function PageRegistrationFeature() {
  const { t, i18n } = useTranslation()

  const { mutateAsync, data, error, isPending } = useRegistrationMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useDocumentTitle(t("pages.authentication.registration.page-title"))

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof registrationFormSchema>) {
    if (!isPasswordStrong(data.password)) {
      form.setError("password", {
        type: "manual",
        message: t("validation.password.not-strong-enough"),
      })
      return
    }

    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: t("validation.confirm-password.match"),
      })
      return
    }

    setErrorMessage(null)

    mutateAsync({
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender === "O" || data.gender === "" ? null : (data.gender as "M" | "F"),
      email: data.email,
      password: data.password,
      language: (i18n.language.split("-")[0].toLowerCase() || "en") as "en" | "fr",
    })
  }

  useEffect(() => {
    if (data) {
      console.log("Registration successful:", data)
    } else if (error) {
      handleErrorResponse(error).then((apiError) => {
        if (apiError) {
          switch (apiError.error_code) {
            case "DRIVER_ALREADY_EXISTS":
              form.setError("email", {
                type: "manual",
              })
              setErrorMessage(t("forms.registration.errors.driver-already-exists"))
              break
            default:
              setErrorMessage(t("forms.errors.unexpected-error"))
          }
          return
        }
        console.error("Registration error:", error)
      })
    }
  }, [data, error, t, form])

  return (
    <PageRegistration
      errorMessage={errorMessage}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
    />
  )
}

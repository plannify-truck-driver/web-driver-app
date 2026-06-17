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
import { useAuth } from "@/app/providers/useAuth"
import { useNavigate } from "@tanstack/react-router"
import { useIsMobile } from "@/hooks/use-mobile"

const STEP_FIELDS: Record<number, (keyof z.infer<typeof registrationFormSchema>)[]> = {
  1: ["firstname", "lastname"],
  2: ["gender"],
  3: ["email"],
}

export default function PageRegistrationFeature() {
  const { t, i18n } = useTranslation()
  const { accessToken, login } = useAuth()
  const navigate = useNavigate()

  const isMobile = useIsMobile()
  const { mutateAsync, data, error, isPending } = useRegistrationMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [workdayRowType, setWorkdayRowType] = useState<1 | 2 | 3>(1)
  const accountCreated = !!data

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

  async function onNextStep() {
    const fields = STEP_FIELDS[step]
    if (fields) {
      const valid = await form.trigger(fields)
      if (!valid) return
    }
    setStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5)
    form.clearErrors()
  }

  function onPrevStep() {
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5)
  }

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
    setStep(5)

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
    if (data && !accessToken) {
      if (!isMobile) {
        login(data.access_token)
        navigate({ to: "/dashboard", replace: true })
      }
    } else if (error) {
      handleErrorResponse(error).then((apiError) => {
        if (apiError) {
          switch (apiError.error_code) {
            case "DRIVER_ALREADY_EXISTS":
              form.setError("email", { type: "manual" })
              setErrorMessage(t("forms.registration.errors.driver-already-exists"))
              setStep(3)
              break
            case "EMAIL_DOMAIN_DENYLISTED":
              form.setError("email", { type: "manual" })
              setErrorMessage(
                t("forms.registration.errors.email-domain-denylisted", {
                  domain: apiError.content?.domain,
                }),
              )
              setStep(3)
              break
            default:
              setErrorMessage(t("forms.errors.unexpected-error"))
              setStep(1)
          }
          return
        }
        setStep(1)
        console.error("Registration error:", error)
      })
    }
  }, [data, error, t, form, accessToken, isMobile, login, navigate])

  function onComplete() {
    if (!data) return
    localStorage.setItem("driver-preferences", String(workdayRowType))
    login(data.access_token)
    navigate({ to: "/dashboard", replace: true })
  }

  return (
    <PageRegistration
      errorMessage={errorMessage}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      step={step}
      onNextStep={onNextStep}
      onPrevStep={onPrevStep}
      workdayRowType={workdayRowType}
      onWorkdayRowTypeChange={setWorkdayRowType}
      accountCreated={accountCreated}
      onComplete={onComplete}
    />
  )
}

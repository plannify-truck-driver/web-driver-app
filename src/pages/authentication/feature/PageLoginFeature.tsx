import { useDocumentTitle } from "@/hooks/use-document-title"
import PageLogin from "../ui/PageLogin"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { loginFormSchema } from "@/shared/zod/login"
import { useLoginMutation } from "@/shared/queries/auth/auth.queries"
import { useEffect, useState } from "react"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/app/providers/AuthProvider"

export default function PageLoginFeature() {
  const { t } = useTranslation()
  const { accessToken, login } = useAuth()
  const navigate = useNavigate()

  const { mutateAsync, data, error, isPending } = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useDocumentTitle(t("pages.authentication.login.page-title"))

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    setErrorMessage(null)
    mutateAsync(data)
  }

  useEffect(() => {
    if (data && !accessToken) {
      login(data.access_token)
      navigate({ to: "/dashboard", replace: true })
    } else if (error) {
      handleErrorResponse(error).then((apiError) => {
        if (apiError) {
          switch (apiError.error_code) {
            case "INVALID_CREDENTIALS":
              setErrorMessage(t("forms.login.errors.invalid-credentials"))
              break
            case "DRIVER_SUSPENDED":
              navigate({ to: "/authentication/suspended", state: apiError.content })
              break
            default:
              setErrorMessage(t("forms.errors.unexpected-error"))
          }
          return
        }
        console.error("Login error:", error)
      })
    }
  }, [data, error, navigate, t, login, accessToken])

  return (
    <PageLogin errorMessage={errorMessage} form={form} loading={isPending} onSubmit={onSubmit} />
  )
}

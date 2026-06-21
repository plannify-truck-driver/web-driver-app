import { useDocumentTitle } from "@/hooks/use-document-title"
import PageLogin from "../ui/PageLogin"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { loginFormSchema } from "@/shared/zod/login"
import { useLoginMutation } from "@/shared/queries/auth/auth.queries"
import { useEffect, useRef, useState } from "react"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useAuth } from "@/app/providers/useAuth"

export default function PageLoginFeature() {
  const { t } = useTranslation()
  const { accessToken, login, refreshToken } = useAuth()
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: "/authentication/login" })
  const hasAttemptedRefresh = useRef(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useDocumentTitle(t("pages.authentication.login.page-title"))

  const { mutateAsync, isPending } = useLoginMutation({
    onSuccess: (data) => {
      login(data.access_token)
      navigate({ to: redirect || "/dashboard", replace: true })
    },
    onError: async (error) => {
      const apiError = await handleErrorResponse(error)
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
    },
  })

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
    if (!accessToken && !hasAttemptedRefresh.current) {
      hasAttemptedRefresh.current = true
      refreshToken().then((response) => {
        if (response) {
          navigate({ to: redirect || "/dashboard", replace: true })
        }
      })
    }
  }, [accessToken, refreshToken, navigate])

  return (
    <PageLogin errorMessage={errorMessage} form={form} loading={isPending} onSubmit={onSubmit} />
  )
}

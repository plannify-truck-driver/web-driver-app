import { useDocumentTitle } from "@/hooks/use-document-title"
import PageLogin from "../ui/PageLogin"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { loginFormSchema } from "@/shared/zod/login"

export default function PageLoginFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.authentication.login.page-title"))

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    console.log(data)
  }

  return <PageLogin form={form} loading={false} onSubmit={onSubmit} />
}

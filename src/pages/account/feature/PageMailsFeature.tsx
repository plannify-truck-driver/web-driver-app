import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useGetMails } from "@/shared/queries/mails/mails.queries"
import PageMails from "../ui/PageMails"

const LIMIT = 10

export default function PageMailsFeature() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  useDocumentTitle(t("pages.account.mails.page-title"))

  const { data, isLoading } = useGetMails({ page, limit: LIMIT })

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1

  return (
    <PageMails
      mails={data?.data ?? []}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      total={data?.total ?? 0}
      onPageChange={setPage}
      onBack={() => navigate({ to: "/account" })}
    />
  )
}

import { useRef, useState } from "react"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import {
  useGetWorkdayGarbage,
  useRestoreWorkday,
  WorkdayActionForbiddenError,
  workdaysKeys,
} from "@/shared/queries/workday/workday.queries"
import { queryClient } from "@/lib/queryClient"
import { toast } from "sonner"
import { handleErrorResponse } from "@/shared/lib/error-response"
import PageWorkdayGarbage from "../ui/PageWorkdayGarbage"

const LIMIT = 10

export default function PageWorkdayGarbageFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.workdays.garbage.page-title"))

  const [documentGeneratedErrorDate, setDocumentGeneratedErrorDate] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetWorkdayGarbage({ page, limit: LIMIT })
  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  // Restoring the last item of the last page empties it: fall back to the new last page.
  if (data && page > totalPages) setPage(totalPages)

  const { mutate: restoreWorkday, isPending: isRestoring } = useRestoreWorkday({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workdaysKeys.all,
        exact: false,
        refetchType: "all",
      })
      toast.success(t("pages.workdays.garbage.restore-success"))
    },
    onError: (error: Error) => {
      if (error instanceof WorkdayActionForbiddenError) return
      handleErrorResponse(error).then((apiError) => {
        if (apiError?.error_code === "WORKDAY_DOCUMENT_ALREADY_GENERATED") {
          setDocumentGeneratedErrorDate(restoringDateRef.current)
        } else {
          toast.error(t("pages.workdays.garbage.restore-error"))
        }
      })
    },
  })

  const restoringDateRef = useRef("")

  function onRestore(date: string) {
    restoringDateRef.current = date
    setDocumentGeneratedErrorDate(null)
    restoreWorkday({ date })
  }

  return (
    <PageWorkdayGarbage
      garbageWorkdays={data?.data ?? []}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      isRestoring={isRestoring}
      onRestore={onRestore}
      documentGeneratedErrorDate={documentGeneratedErrorDate}
      onDismissDocumentGeneratedError={() => setDocumentGeneratedErrorDate(null)}
    />
  )
}

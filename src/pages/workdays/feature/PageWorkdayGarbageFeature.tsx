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

export default function PageWorkdayGarbageFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.workdays.garbage.page-title"))

  const [documentGeneratedErrorDate, setDocumentGeneratedErrorDate] = useState<string | null>(null)

  const { data: garbageWorkdays, isLoading } = useGetWorkdayGarbage()

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
      garbageWorkdays={garbageWorkdays ?? []}
      isLoading={isLoading}
      isRestoring={isRestoring}
      onRestore={onRestore}
      documentGeneratedErrorDate={documentGeneratedErrorDate}
      onDismissDocumentGeneratedError={() => setDocumentGeneratedErrorDate(null)}
    />
  )
}

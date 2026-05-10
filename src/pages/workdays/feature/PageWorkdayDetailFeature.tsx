import { useEffect, useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import z from "zod"
import {
  useDeleteWorkday,
  useGetWorkdayByDate,
  useUpdateWorkday,
  workdaysKeys,
} from "@/shared/queries/workday/workday.queries"
import { useGetRestPeriods } from "@/shared/queries/rest-period/rest-period.queries"
import { workdayDocumentsKeys } from "@/shared/queries/documents/document.queries"
import { editWorkdayFormSchema } from "@/shared/zod/edit-workday"
import PageWorkdayDetail from "../ui/PageWorkdayDetail"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { handleErrorResponse } from "@/shared/lib/error-response"

export default function PageWorkdayDetailFeature() {
  const { t } = useTranslation()
  const { workdayDate } = useParams({ from: "/workdays/$workdayDate" })

  useDocumentTitle(t("pages.workdays.detail.page-title"))

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isDocumentAlreadyGenerated, setIsDocumentAlreadyGenerated] = useState(false)

  const { data: workday, isLoading } = useGetWorkdayByDate({ date: workdayDate })
  const { data: restPeriods, isLoading: isLoadingRestPeriods } = useGetRestPeriods()

  const form = useForm<z.infer<typeof editWorkdayFormSchema>>({
    resolver: zodResolver(editWorkdayFormSchema),
    defaultValues: { startTime: "", endTime: "", restTime: "", overnight: false },
  })

  useEffect(() => {
    if (workday) {
      form.reset({
        startTime: workday.start_time.slice(0, 5),
        endTime: workday.end_time ? workday.end_time.slice(0, 5) : "",
        restTime: workday.rest_time === "00:00:00" ? "" : workday.rest_time.slice(0, 5),
        overnight: workday.overnight_rest,
      })
    }
  }, [workday, form])

  const { mutateAsync: updateWorkdayAsync, isPending: isUpdating } = useUpdateWorkday({
    onSuccess: () => {
      setIsDocumentAlreadyGenerated(false)
      queryClient.invalidateQueries({
        queryKey: workdaysKeys.all,
        exact: false,
        refetchType: "all",
      })
      toast.success(t("pages.workdays.detail.save-success"))
    },
    onError: (error: Error) => {
      handleErrorResponse(error).then((apiError) => {
        if (apiError?.error_code === "WORKDAY_DOCUMENT_ALREADY_GENERATED") {
          setIsDocumentAlreadyGenerated(true)
        } else {
          toast.error(t("pages.workdays.errors.workday-update-error"))
        }
      })
    },
  })

  const { mutateAsync: deleteWorkdayAsync, isPending: isDeleting } = useDeleteWorkday({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workdaysKeys.all,
        exact: false,
        refetchType: "all",
      })
      queryClient.invalidateQueries({
        queryKey: workdayDocumentsKeys.all,
        exact: false,
        refetchType: "all",
      })
      toast.success(t("pages.workdays.detail.delete-success"))
      navigate({ to: "/workdays" })
    },
    onError: (error: Error) => {
      handleErrorResponse(error).then((apiError) => {
        if (apiError?.error_code === "WORKDAY_DOCUMENT_ALREADY_GENERATED") {
          setIsDocumentAlreadyGenerated(true)
        } else {
          toast.error(t("pages.workdays.errors.workday-update-error"))
        }
      })
    },
  })

  const onSave = async (values: z.infer<typeof editWorkdayFormSchema>) => {
    await updateWorkdayAsync({
      date: workdayDate,
      start_time: values.startTime,
      end_time: values.endTime?.trim() || null,
      rest_time: values.restTime?.trim() || "00:00:00",
      overnight_rest: values.overnight,
    })
    form.reset(values)
  }

  const onDelete = () => deleteWorkdayAsync({ date: workdayDate })

  return (
    <PageWorkdayDetail
      workdayDate={workdayDate}
      workday={workday ?? null}
      isLoading={isLoading}
      restPeriods={restPeriods ?? []}
      isLoadingRestPeriods={isLoadingRestPeriods}
      form={form}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      onSave={onSave}
      onDelete={onDelete}
      showDocumentGeneratedError={isDocumentAlreadyGenerated}
      onDismissDocumentGeneratedError={() => setIsDocumentAlreadyGenerated(false)}
    />
  )
}

import { useTranslation } from "react-i18next"
import PageRestPreferences from "../ui/PageRestPreferences"
import { useDocumentTitle } from "@/hooks/use-document-title"
import {
  useCreateRestPeriod,
  useDeleteRestPeriod,
  useGetRestPeriods,
  restPeriodsKeys,
} from "@/shared/queries/rest-period/rest-period.queries"
import { useEffect, useMemo, useState } from "react"
import type { CreateRestPeriodRequest } from "@/shared/queries/rest-period/rest-period.types"
import type { RestPeriod } from "@/shared/models/rest-period"
import { queryClient } from "@/lib/queryClient"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import z from "zod"
import { addRestPeriodFormSchema } from "@/shared/zod/add-rest-period"
import { zodResolver } from "@hookform/resolvers/zod"

export default function PageRestPreferencesFeature() {
  const { t } = useTranslation()

  useDocumentTitle(t("pages.settings.rest-preferences.page-title"))

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)

  const { data: restPeriods, isLoading: isLoadingGetRestPeriods } = useGetRestPeriods()
  const { mutate: createRestPeriod, isPending: isLoadingCreateRestPeriod } = useCreateRestPeriod({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restPeriodsKeys.all })
      toast.success(t("pages.settings.rest-preferences.toast.save-success"))
    },
    onError: () => {
      toast.error(t("pages.settings.rest-preferences.toast.save-error"))
    },
  })
  const { mutate: deleteRestPeriod, isPending: isLoadingDeleteRestPeriod } = useDeleteRestPeriod({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restPeriodsKeys.all })
      toast.success(t("pages.settings.rest-preferences.toast.reset-success"))
    },
    onError: () => {
      toast.error(t("pages.settings.rest-preferences.toast.reset-error"))
    },
  })

  const loadings = useMemo(
    () => ({
      isLoadingGetRestPeriods,
      isLoadingCreateRestPeriod,
      isLoadingDeleteRestPeriod,
    }),
    [isLoadingCreateRestPeriod, isLoadingDeleteRestPeriod, isLoadingGetRestPeriods]
  )

  const form = useForm<z.infer<typeof addRestPeriodFormSchema>>({
    resolver: zodResolver(addRestPeriodFormSchema),
    defaultValues: { end: "", isEndOfDay: false, restMins: 0 },
  })

  useEffect(() => {
    if (isAddDialogOpen) {
      form.reset({ end: "", isEndOfDay: false, restMins: 0 })
    }
  }, [isAddDialogOpen, form])

  const onCreateRestPeriod = (restPeriods: RestPeriod[]) => {
    const newRestPeriod: CreateRestPeriodRequest = {
      rest_periods: restPeriods,
    }
    createRestPeriod(newRestPeriod)
  }

  return (
    <PageRestPreferences
      restPeriods={restPeriods ?? []}
      form={form}
      loadings={loadings}
      isAddDialogOpen={isAddDialogOpen}
      setIsAddDialogOpen={setIsAddDialogOpen}
      onCreateRestPeriod={onCreateRestPeriod}
      onDeleteRestPeriod={deleteRestPeriod}
    />
  )
}

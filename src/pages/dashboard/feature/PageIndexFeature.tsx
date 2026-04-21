import {
  useCreateWorkday,
  useDeleteWorkday,
  useGetWorkdayByDate,
  useGetWorkdaysByMonth,
  useGetWorkdaysByPeriod,
  useRestoreWorkday,
  useUpdateWorkday,
  workdaysKeys,
} from "@/shared/queries/workday/workday.queries"
import PageDashboardIndex from "../ui/PageIndex"
import { useMemo, useState } from "react"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { displayDuration } from "@/shared/functions/displayDuration"
import { getWeek } from "@/shared/functions/getWeek"
import { workdayDocumentsKeys } from "@/shared/queries/documents/document.queries"

export interface PeriodOfTime {
  from: Date
  to: Date
}

export default function PageDashboardIndexFeature() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  useDocumentTitle(t("navigation.dashboard.navigation-title.desktop"))

  const today: Date = useMemo(() => new Date(), [])

  const [period, setPeriod] = useState<PeriodOfTime>(getWeek(today))

  const {
    data: periodWorkdays,
    isLoading: isPeriodWorkdaysLoading,
    error,
  } = useGetWorkdaysByPeriod({
    from: period.from.toISOString().split("T")[0],
    to: period.to.toISOString().split("T")[0],
    page: 1,
    limit: 100,
  })
  const { data: monthWorkdays, isLoading: isMonthWorkdaysLoading } = useGetWorkdaysByMonth({
    month: (period.from.getMonth() + 1).toString().padStart(2, "0"),
    year: period.from.getFullYear().toString(),
  })
  const { data: todayWorkday, isLoading: isTodayWorkdayLoading } = useGetWorkdayByDate({
    date: today.toISOString().split("T")[0],
  })
  const { mutateAsync: createWorkdayAsync, isPending: isCreatingWorkday } = useCreateWorkday({
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
    },
    onError: (error: Error) => {
      handleErrorResponse(error).then((apiError) => {
        if (apiError?.error_code === "WORKDAY_ALREADY_EXISTS") {
          restoreWorkdayAsync({
            date: today.toISOString().split("T")[0],
          })
        } else {
          toast.error(t("pages.dashboard.workday-creation-error"))
        }
      })
    },
  })
  const { mutateAsync: updateWorkdayAsync, isPending: isUpdatingWorkday } = useUpdateWorkday({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workdaysKeys.all,
        exact: false,
        refetchType: "all",
      })
    },
    onError: (error: Error) => {
      toast.error(t("pages.dashboard.workday-update-error"))
      console.error("Failed to update workday:", error)
    },
  })
  const { mutateAsync: deleteWorkdayAsync, isPending: isDeletingWorkday } = useDeleteWorkday({
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
    },
    onError: (error: Error) => {
      toast.error(t("pages.dashboard.workday-deletion-error"))
      console.error("Failed to delete workday:", error)
    },
  })
  const { mutateAsync: restoreWorkdayAsync, isPending: isRestoringWorkday } = useRestoreWorkday({
    onSuccess: () => {
      console.warn("Workday already exists for today, restoring it from garbage...")
      const now = new Date()
      updateWorkdayAsync({
        date: today.toISOString().split("T")[0],
        start_time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
          .getSeconds()
          .toString()
          .padStart(2, "0")}`,
        end_time: null,
        rest_time: "00:00:00",
        overnight_rest: false,
      })
      queryClient.invalidateQueries({
        queryKey: workdayDocumentsKeys.all,
        exact: false,
        refetchType: "all",
      })
    },
    onError: (error: Error) => {
      console.error("Failed to restore workday:", error)
      toast.error(t("pages.dashboard.workday-restoration-error"))
    },
  })

  const onPreviousPeriod = () => {
    const newFrom = new Date(period.from)
    newFrom.setDate(newFrom.getDate() - 7)
    const newTo = new Date(period.to)
    newTo.setDate(newTo.getDate() - 7)
    setPeriod({ from: newFrom, to: newTo })
  }

  const onNextPeriod = () => {
    const newFrom = new Date(period.from)
    newFrom.setDate(newFrom.getDate() + 7)
    const newTo = new Date(period.to)
    newTo.setDate(newTo.getDate() + 7)
    setPeriod({ from: newFrom, to: newTo })
  }

  const totalWorkingTime: string = useMemo(() => {
    if (monthWorkdays) {
      const seconds = monthWorkdays.reduce(
        (acc, workday) =>
          acc + getWorkingTime(workday.start_time, workday.end_time, workday.rest_time),
        0
      )

      return displayDuration(
        `${Math.floor(seconds / 3600)}:${Math.floor((seconds % 3600) / 60)}`,
        t
      )
    }
    return "0h"
  }, [monthWorkdays, t])

  const onStartWorkday = () => {
    const now = new Date()
    createWorkdayAsync({
      date: today.toISOString().split("T")[0],
      start_time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`,
      end_time: null,
      rest_time: "00:00:00",
      overnight_rest: false,
    })
  }

  const onEndWorkday = () => {
    if (!todayWorkday) {
      toast.error(t("pages.dashboard.workday-not-found-error"))
    }

    const now = new Date()
    updateWorkdayAsync({
      date: todayWorkday!.date,
      start_time: todayWorkday!.start_time,
      end_time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`,
      rest_time: todayWorkday!.rest_time,
      overnight_rest: todayWorkday!.overnight_rest,
    })
  }

  const onDeleteWorkday = () => {
    deleteWorkdayAsync({
      date: today.toISOString().split("T")[0],
    })
  }

  return (
    <PageDashboardIndex
      workdays={periodWorkdays?.data ?? []}
      todayWorkday={todayWorkday ?? null}
      period={period}
      isPeriodWorkdaysLoading={isPeriodWorkdaysLoading}
      isMonthWorkdaysLoading={isMonthWorkdaysLoading}
      isTodayWorkdayLoading={isTodayWorkdayLoading}
      isCreatingWorkday={isCreatingWorkday || isUpdatingWorkday || isRestoringWorkday}
      isUpdatingWorkday={isUpdatingWorkday}
      isDeletingWorkday={isDeletingWorkday}
      error={error}
      totalWorkingTime={totalWorkingTime}
      onNextPeriod={onNextPeriod}
      onPreviousPeriod={onPreviousPeriod}
      onStartWorkday={onStartWorkday}
      onEndWorkday={onEndWorkday}
      onDeleteWorkday={onDeleteWorkday}
    />
  )
}

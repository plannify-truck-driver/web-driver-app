import {
  useCreateWorkday,
  useDeleteWorkday,
  useGetWorkdayByDate,
  useGetWorkdayCreationLimit,
  useGetWorkdaysByMonth,
  useGetWorkdaysByPeriod,
  useRestoreWorkday,
  useUpdateWorkday,
  workdaysKeys,
} from "@/shared/queries/workday/workday.queries"
import PageDashboardIndex from "../ui/PageIndex"
import { useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { endWorkdayRestSchema } from "@/shared/zod/end-workday-rest"
import type z from "zod"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { getWorkingTime } from "@/shared/functions/getWorkingTime"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { displayDuration } from "@/shared/functions/displayDuration"
import { getWeek } from "@/shared/functions/getWeek"
import { workdayDocumentsKeys } from "@/shared/queries/documents/document.queries"
import { useGetRestPeriods } from "@/shared/queries/rest-period/rest-period.queries"
import { getBestRestPeriod } from "@/shared/functions/getBestRestPeriod"
import { useRestPeriodBannerDismiss } from "@/hooks/use-rest-period-banner-dismiss"
import { useMaxWorkdayDuration } from "@/hooks/use-max-workday-duration"
import { getCanEndWorkday, isWithinWorkdayWindow } from "@/shared/functions/getCanEndWorkday"
import { toLocalDateString } from "@/shared/functions/toLocalDateString"
import { useShowSeconds } from "@/hooks/use-show-seconds"

export interface PeriodOfTime {
  from: Date
  to: Date
}

export default function PageDashboardIndexFeature() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { showSeconds } = useShowSeconds()

  const buildTimeString = (date: Date) => {
    const hh = date.getHours().toString().padStart(2, "0")
    const mm = date.getMinutes().toString().padStart(2, "0")
    const ss = date.getSeconds().toString().padStart(2, "0")
    return showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}:00`
  }

  useDocumentTitle(t("navigation.dashboard.navigation-title.desktop"))

  const today: Date = useMemo(() => new Date(), [])
  const yesterday: Date = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() - 1)
    return d
  }, [today])

  const todayLocalDate = toLocalDateString(today)
  const yesterdayLocalDate = toLocalDateString(yesterday)

  const [period, setPeriod] = useState<PeriodOfTime>(getWeek(today))
  const [isDocumentAlreadyGenerated, setIsDocumentAlreadyGenerated] = useState(false)
  const [isEndWorkdayRestDialogOpen, setIsEndWorkdayRestDialogOpen] = useState(false)
  const pendingEndTimeRef = useRef<string | null>(null)
  const endWorkdayRestForm = useForm<z.infer<typeof endWorkdayRestSchema>>({
    resolver: zodResolver(endWorkdayRestSchema),
    defaultValues: { restMins: 0 },
  })

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
  const { data: restPeriods, isLoading: isLoadingRestPeriods } = useGetRestPeriods()
  const { isVisible: isBannerVisible, dismiss: onDismissBanner } = useRestPeriodBannerDismiss()
  const { maxHours } = useMaxWorkdayDuration()

  const { data: todayWorkday, isLoading: isTodayWorkdayLoading } = useGetWorkdayByDate({
    date: todayLocalDate,
  })
  const { data: yesterdayWorkday, isLoading: isYesterdayWorkdayLoading } = useGetWorkdayByDate({
    date: yesterdayLocalDate,
    enabled: !isTodayWorkdayLoading,
  })

  const activeWorkday = (() => {
    // Unfinished yesterday workday within the window takes priority (overnight shift)
    if (
      yesterdayWorkday &&
      !yesterdayWorkday.end_time &&
      isWithinWorkdayWindow(yesterdayWorkday, maxHours)
    ) {
      return yesterdayWorkday
    }
    if (todayWorkday) return todayWorkday

    // Finished yesterday workday still within the window (show recap)
    if (yesterdayWorkday && isWithinWorkdayWindow(yesterdayWorkday, maxHours)) {
      return yesterdayWorkday
    }

    return null
  })()
  const isActiveWorkdayLoading = isTodayWorkdayLoading || isYesterdayWorkdayLoading

  const { data: creationLimit } = useGetWorkdayCreationLimit()
  const isCreationLimitReached = creationLimit?.remaining === 0

  const { mutateAsync: createWorkdayAsync, isPending: isCreatingWorkday } = useCreateWorkday({
    onSuccess: () => {
      setIsDocumentAlreadyGenerated(false)
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
        if (
          apiError?.error_code === "WORKDAY_ALREADY_EXISTS" ||
          apiError?.error_code === "WORKDAY_GARBAGE_ALREADY_EXISTS"
        ) {
          restoreWorkdayAsync({ date: todayLocalDate })
        } else if (apiError?.error_code === "WORKDAY_DOCUMENT_ALREADY_GENERATED") {
          setIsDocumentAlreadyGenerated(true)
        } else if (apiError?.error_code === "WORKDAY_CREATION_LIMIT_REACHED") {
          queryClient.invalidateQueries({
            queryKey: workdaysKeys.getCreationLimit(),
            exact: true,
          })
          toast.error(t("pages.dashboard.workday-creation-limit-reached"))
        } else {
          toast.error(t("pages.dashboard.workday-creation-error"))
        }
      })
    },
  })
  const { mutateAsync: updateWorkdayAsync, isPending: isUpdatingWorkday } = useUpdateWorkday({
    onSuccess: () => {
      setIsDocumentAlreadyGenerated(false)
      queryClient.invalidateQueries({
        queryKey: workdaysKeys.all,
        exact: false,
        refetchType: "all",
      })
    },
    onError: (error: Error) => {
      handleErrorResponse(error).then((apiError) => {
        if (apiError?.error_code === "WORKDAY_DOCUMENT_ALREADY_GENERATED") {
          setIsDocumentAlreadyGenerated(true)
        } else {
          toast.error(t("pages.dashboard.workday-update-error"))
        }
      })
    },
  })
  const { mutateAsync: deleteWorkdayAsync, isPending: isDeletingWorkday } = useDeleteWorkday({
    onSuccess: () => {
      setIsDocumentAlreadyGenerated(false)
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
        if (apiError?.error_code === "WORKDAY_DOCUMENT_ALREADY_GENERATED") {
          setIsDocumentAlreadyGenerated(true)
        } else {
          toast.error(t("pages.dashboard.workday-deletion-error"))
        }
      })
    },
  })
  const { mutateAsync: restoreWorkdayAsync, isPending: isRestoringWorkday } = useRestoreWorkday({
    onSuccess: () => {
      console.warn("Workday already exists for today, restoring it from garbage...")
      const now = new Date()
      updateWorkdayAsync({
        date: todayLocalDate,
        start_time: buildTimeString(now),
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
      date: todayLocalDate,
      start_time: buildTimeString(now),
      end_time: null,
      rest_time: "00:00:00",
      overnight_rest: false,
    })
  }

  const onEndWorkday = () => {
    if (isLoadingRestPeriods) {
      toast.info(t("pages.dashboard.rest-periods-loading"))
      return
    }

    if (!activeWorkday) {
      toast.error(t("pages.dashboard.workday-not-found-error"))
      return
    }

    if (!getCanEndWorkday(activeWorkday, maxHours)) {
      toast.error(t("pages.dashboard.workday-too-old-error", { maxHours }))
      return
    }

    const now = new Date()
    const endTime = buildTimeString(now)

    if (!restPeriods || restPeriods.length === 0) {
      pendingEndTimeRef.current = endTime
      endWorkdayRestForm.reset({ restMins: 0 })
      setIsEndWorkdayRestDialogOpen(true)
      return
    }

    const bestRestTime = getBestRestPeriod(activeWorkday.start_time, endTime, restPeriods)
    updateWorkdayAsync({
      date: activeWorkday.date,
      start_time: activeWorkday.start_time,
      end_time: endTime,
      rest_time: bestRestTime ?? activeWorkday.rest_time,
      overnight_rest: activeWorkday.overnight_rest,
    })
  }

  const onConfirmEndWorkday = (values: z.infer<typeof endWorkdayRestSchema>) => {
    if (!activeWorkday || !pendingEndTimeRef.current) return
    const totalSecs = values.restMins * 60
    const hh = Math.floor(totalSecs / 3600)
      .toString()
      .padStart(2, "0")
    const mm = Math.floor((totalSecs % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const ss = (totalSecs % 60).toString().padStart(2, "0")
    updateWorkdayAsync({
      date: activeWorkday.date,
      start_time: activeWorkday.start_time,
      end_time: pendingEndTimeRef.current,
      rest_time: `${hh}:${mm}:${ss}`,
      overnight_rest: activeWorkday.overnight_rest,
    })
    setIsEndWorkdayRestDialogOpen(false)
    pendingEndTimeRef.current = null
  }

  const onDeleteWorkday = () => {
    deleteWorkdayAsync({
      date: activeWorkday?.date ?? todayLocalDate,
    })
  }

  return (
    <PageDashboardIndex
      workdays={periodWorkdays?.data ?? []}
      todayWorkday={activeWorkday ?? null}
      period={period}
      isPeriodWorkdaysLoading={isPeriodWorkdaysLoading}
      isMonthWorkdaysLoading={isMonthWorkdaysLoading}
      isTodayWorkdayLoading={isActiveWorkdayLoading}
      showRestPeriodSuggestion={
        !isLoadingRestPeriods && !(restPeriods && restPeriods.length > 0) && isBannerVisible
      }
      onDismissRestPeriodSuggestion={onDismissBanner}
      isCreatingWorkday={isCreatingWorkday || isUpdatingWorkday || isRestoringWorkday}
      isUpdatingWorkday={isUpdatingWorkday}
      isDeletingWorkday={isDeletingWorkday}
      error={error}
      totalWorkingTime={totalWorkingTime}
      onNextPeriod={onNextPeriod}
      onPreviousPeriod={onPreviousPeriod}
      canEndWorkday={getCanEndWorkday(activeWorkday ?? null, maxHours)}
      onStartWorkday={onStartWorkday}
      onEndWorkday={onEndWorkday}
      onDeleteWorkday={onDeleteWorkday}
      isEndWorkdayRestDialogOpen={isEndWorkdayRestDialogOpen}
      endWorkdayRestForm={endWorkdayRestForm}
      onEndWorkdayRestDialogClose={() => setIsEndWorkdayRestDialogOpen(false)}
      onConfirmEndWorkday={onConfirmEndWorkday}
      showDocumentGeneratedError={isDocumentAlreadyGenerated}
      onDismissDocumentGeneratedError={() => setIsDocumentAlreadyGenerated(false)}
      isCreationLimitReached={isCreationLimitReached}
    />
  )
}

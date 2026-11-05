import { useMutation, useQueries, useQuery } from "@tanstack/react-query"
import type {
  GenerateWorkdayDocumentResponse,
  GetWorkdayDocumentsByYearsRequest,
} from "./document.types"
import {
  generateWorkdayDocument,
  getUpcomingWorkdayDocuments,
  getWorkdayDocuments,
  getWorkdayDocumentsByYear,
} from "./document.api"

export const workdayDocumentsKeys = {
  all: ["workday-documents"] as const,
  getWorkdayDocumentsByYear: (year: number) =>
    [...workdayDocumentsKeys.all, `workday-documents-year-${year}`] as const,
  upcoming: () => [...workdayDocumentsKeys.all, "workday-documents-upcoming"] as const,
}

export const useGetWorkdayDocuments = () =>
  useQuery({
    queryKey: workdayDocumentsKeys.all,
    queryFn: () => getWorkdayDocuments(),
  })

// Upcoming generations are only announced during the last 7 days of the current month
export const useGetUpcomingWorkdayDocuments = () => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const isEndOfMonth = lastDayOfMonth - now.getDate() < 7

  const { data } = useQuery({
    queryKey: workdayDocumentsKeys.upcoming(),
    queryFn: () => getUpcomingWorkdayDocuments(),
    enabled: isEndOfMonth,
  })

  return isEndOfMonth ? (data ?? []) : []
}

export const useGetWorkdayDocumentsByYears = (request: GetWorkdayDocumentsByYearsRequest) =>
  useQueries({
    queries: request.years.map((year) => ({
      queryKey: workdayDocumentsKeys.getWorkdayDocumentsByYear(year),
      queryFn: () => getWorkdayDocumentsByYear({ year }),
    })),
  })

export const useGenerateWorkdayDocument = (options?: {
  onSuccess?: (data: GenerateWorkdayDocumentResponse) => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      generateWorkdayDocument({ month, year }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })

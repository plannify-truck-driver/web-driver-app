import { useMutation, useQueries, useQuery } from "@tanstack/react-query"
import type { GenerateWorkdayDocumentResponse, GetWorkdayDocumentsByYearsRequest } from "./document.types"
import {
  generateWorkdayDocument,
  getWorkdayDocuments,
  getWorkdayDocumentsByYear,
} from "./document.api"

export const workdayDocumentsKeys = {
  all: ["workday-documents"] as const,
  getWorkdayDocumentsByYear: (year: number) =>
    [...workdayDocumentsKeys.all, `workday-documents-year-${year}`] as const,
}

export const useGetWorkdayDocuments = () =>
  useQuery({
    queryKey: workdayDocumentsKeys.all,
    queryFn: () => getWorkdayDocuments(),
  })

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

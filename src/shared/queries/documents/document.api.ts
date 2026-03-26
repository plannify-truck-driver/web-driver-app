import { api } from "@/shared/lib/api"
import type {
  GetWorkdayDocumentsByYearRequest,
  GetWorkdayDocumentsByYearResponse,
} from "./document.types"

export const getWorkdayDocuments = (): Promise<number[]> => {
  return api.get("workdays/documents/year").json()
}

export const getWorkdayDocumentsByYear = (
  body: GetWorkdayDocumentsByYearRequest
): Promise<GetWorkdayDocumentsByYearResponse> => {
  return api.get(`workdays/documents/${body.year}`).json()
}

export const generateWorkdayDocument = (month: number, year: number): Promise<void> => {
  return api.get(`workdays/documents/${year}/${month}`).json()
}

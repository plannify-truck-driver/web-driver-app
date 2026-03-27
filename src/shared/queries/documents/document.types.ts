import type { WorkdayDocument } from "@/shared/models/workday"

export type GetWorkdayDocuments = number[]

export interface GetWorkdayDocumentsByYearRequest {
  year: number
}

export interface GetWorkdayDocumentsByYearsRequest {
  years: number[]
}

export type GetWorkdayDocumentsByYearResponse = WorkdayDocument[]

export interface GenerateWorkdayDocumentRequest {
  month: number
  year: number
}

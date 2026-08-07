export type InformationType = "INFO" | "WARNING"

export interface Information {
  start_at: string
  end_at: string
  type: InformationType
  message: Record<string, string> | null
}

export type GetInformationsResponse = Information[]

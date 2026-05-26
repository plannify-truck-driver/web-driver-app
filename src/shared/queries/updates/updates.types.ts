export interface Update {
  version: string
  description: string
  mandatory_completion_date: string | null
}

export interface UpdatesResponse {
  data: Update[]
  page: number
  total: number
}

export interface UpdatesParams {
  version?: string
  page?: number
  limit?: number
}

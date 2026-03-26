export interface Workday {
  date: string
  start_time: string
  end_time: string | null
  rest_time: string
  overnight_rest: boolean
}

export interface WorkdayDocument {
  month: number
  year: number
  generated_at: string | null
}

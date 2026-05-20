export interface Workday {
  date: string
  start_time: string
  end_time: string | null
  rest_time: string
  overnight_rest: boolean
}

export interface WorkdayGarbage {
  workday_date: string
  scheduled_deletion_date: string
  created_at: string
}

export interface WorkdayDocument {
  month: number
  year: number
  generated_at: string | null
}

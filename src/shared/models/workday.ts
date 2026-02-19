export interface Workday {
  date: string
  start_time: string
  end_time: string | null
  rest_time: string
  overnight_rest: boolean
}

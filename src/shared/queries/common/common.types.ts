export interface ErrorResponse {
  status: number
  message: string
  error_code?: string
  content?: Record<string, unknown>
}

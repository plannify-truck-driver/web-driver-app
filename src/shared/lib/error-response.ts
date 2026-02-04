import type { ErrorResponse } from "../queries/common/common.types"

export async function handleErrorResponse(error: unknown): Promise<ErrorResponse | undefined> {
  if (error && typeof error === "object" && "response" in error) {
    const bodyData = await (error.response as Response).json()
    return bodyData as ErrorResponse
  }

  return undefined
}

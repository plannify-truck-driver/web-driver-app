import z from "zod"

export const addRestPeriodFormSchema = z.object({
  end: z.string().optional(),
  isEndOfDay: z.boolean(),
  restMins: z.number().int().min(0).max(720),
})

import z from "zod"

export const editWorkdayFormSchema = z.object({
  startTime: z.string().trim().min(1, { message: "validation.start-time.required" }),
  endTime: z.string().optional(),
  restTime: z.string().optional(),
  overnight: z.boolean(),
})
